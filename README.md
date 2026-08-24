# Янголи хвостиків — frontend 

Next.js-приложение с публичным сайтом фонда. Публичный контент строится по модели static-first: страницы создаются во время production build, сохраняются без периодического TTL и точечно инвалидируются подписанным webhook из Sanity.

## Запуск

```bash
yarn install --frozen-lockfile
copy .env.example .env.local
yarn dev
```

Основные проверки:

```bash
yarn typecheck
yarn lint
yarn test
yarn build
yarn check:bundles
yarn audit:images
yarn audit:dependencies
```

Playwright smoke-тесты требуют установленного Chromium и production build:

```bash
yarn playwright install chromium
yarn build
yarn test:e2e
```

## Архитектурные границы

Целевая зависимость: `app → modules/widgets → features → shared`.

- `src/app` содержит маршруты, layouts, metadata, error boundaries и route handlers.
- `src/modules` — существующие крупные секции страниц; новые доменные секции следует размещать в `features/*/ui` или выделять в `widgets`.
- `src/features/{tails,blog,reports,home,events}` содержит DTO, преобразования, GROQ и server-only data access.
- `src/shared` содержит универсальные UI, конфигурацию, i18n и инфраструктуру.

ESLint запрещает обратные импорты из `shared` в features/modules/app и из features в modules/app. Платёжный и WayForPay-код временно исключён из этого этапа и будет мигрирован отдельно.

## Кэширование Sanity

Все публичные чтения проходят через `src/shared/lib/sanity.server.ts`. `sanityFetch` использует `force-cache`, `revalidate: false` и доменные cache tags. React `cache()` дедуплицирует одинаковые запросы page/metadata в одном серверном рендере.

Динамические slug-маршруты имеют `dynamicParams = true`: существующие документы генерируются на build, новые slug — при первом обращении. Для неизвестного или удалённого slug вызывается `notFound()`.

### Sanity webhook

Endpoint: `POST /api/revalidate`.

Обязательные переменные: `SANITY_REVALIDATE_SECRET`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`. Webhook должен быть подписан тем же секретом и передавать заголовки Sanity project/dataset/operation/transaction id.

Минимальная projection payload:

```groq
{
  "_id": coalesce(after()._id, before()._id),
  "_type": coalesce(after()._type, before()._type),
  "oldSlug": before().slug.current,
  "newSlug": after().slug.current
}
```

Filter: `_type in ["post", "tail", "reports", "donator", "collection", "perfomance", "partner", "aboutFoundation", "events", "siteSettings"]`. Drafts и versions в настройках webhook должны быть выключены.

В Sanity webhook включаются Create, Update и Delete опубликованных документов. Endpoint дополнительно игнорирует `_id`, начинающиеся с `drafts.` или `versions.`, проверяет допустимый тип и инвалидирует только его tags и localized paths.

При смене slug инвалидируются старый и новый detail URL, список и sitemap. Логи содержат только transaction id, operation, тип и количество целей — содержимое документа не журналируется.

### Полная инвалидация

Аварийный endpoint `POST /api/revalidate/all` защищён Bearer-токеном `REVALIDATE_OPS_SECRET` и вызывает `revalidatePath("/", "layout")`.

```bash
curl -X POST https://example.org/api/revalidate/all \
  -H "Authorization: Bearer $REVALIDATE_OPS_SECRET"
```

Или задать `REVALIDATE_SITE_URL` и `REVALIDATE_OPS_SECRET`, затем выполнить `yarn revalidate:all`.

Использовать только при сбое webhook или изменении схемы.

### Draft preview

Preview включается защищённым URL `/api/draft/enable?secret=…&locale=uk&type=blog&slug=…`. Поддерживаются `blog`, `tails` и `reporting`. Preview-маршрут использует `SANITY_API_READ_TOKEN`, perspective `drafts`, `no-store` и `noindex`; публичный cache он не затрагивает. Выход: `/api/draft/disable?locale=uk`.

## Платежи WayForPay

Регулярные ежемесячные пожертвования, модель отдельных списаний и checklist для владельца кабинета описаны в [`docs/wayforpay-recurring-handoff.md`](docs/wayforpay-recurring-handoff.md).

`POST /api/wayforpay/callback` принимает только подписанные callback WayForPay, сверяет их с приватным Sanity dataset `payments` и возвращает подписанный `accept`. Публичный dataset `production` не содержит платежные данные.

`GET /api/wayforpay/cleanup` удаляет только заказы в состоянии `created` без callback старше 30 дней. Он защищён `Authorization: Bearer $CRON_SECRET`; для Vercel ежедневный запуск задан в `vercel.json`.

`GET /api/wayforpay/reconcile` запускает подписанный `CHECK_STATUS` для зависших заказов и сохраняет проверенный ответ как отдельное reconciliation-событие. Спецификация запроса и подписи: [WayForPay CHECK_STATUS](https://wiki.wayforpay.com/en/view/852117).

Неанонимный подтверждённый донат от 1 000 UAH автоматически создаёт/обновляет существующий документ `donator` в content dataset. Для этого `SANITY_API_TOKEN` должен иметь право записи в content dataset.

Обязательные server-side переменные: `SANITY_PAYMENTS_DATASET`, `SANITY_PAYMENTS_TOKEN`, `PAYMENTS_ENCRYPTION_KEY`, `WAYFORPAY_ACCOUNT`, `WAYFORPAY_SECRET`, `WAYFORPAY_DOMAIN`, `NEXT_PUBLIC_BASE_URL`.

`PAYMENTS_ENCRYPTION_KEY` — base64-encoded 32-byte ключ для AES-256-GCM. В него шифруются raw callback, `recToken` и `repayUrl`; email и телефон сохраняются только когда заказ содержит согласие на уведомления. Не передавать эти переменные в браузер и не добавлять в публичный dataset.

В Studio доступны workspace `/content` для контента и `/payments` для read-only платежных документов. Доступ к `payments` должен быть выдан только сотрудникам, которым разрешена работа с платежными данными.

Соцсети сайта, публичная банка Monobank для разовых донатов и переключатель таблицы топ донаторов хранятся в singleton-документе `siteSettings` (Instagram, Facebook, Twitter/X, Telegram, YouTube, `monobankJarUrl`, `showTopDonors`). `showTopDonors` по умолчанию включён; выключение скрывает блок «Янголи» на главной, не удаляя документы `donator`. Пустые соцсети и URL с чужим доменом на сайте не показываются. `monobankJarUrl` должен быть ссылкой `https://send.monobank.ua/jar/…`; её используют хедер «Разова допомога» и форма в hero. Если поле пустое, эти кнопки остаются на WayForPay. Первичное заполнение: Studio → «Налаштування сайту» или `node --env-file=.env.local scripts/seed-site-settings.mjs` (нужен `SANITY_API_TOKEN`).

## Статические маршруты и локализация

Build генерирует `uk` и `en`, статические контентные маршруты и все существующие blog/tail/report slug. `next-intl` использует единственные словари `public/messages/{locale}.json`. Locale проверяется в root locale layout, а `setRequestLocale` вызывается во всех страницах. Canonical, Open Graph и alternate locales собираются централизованно; sitemap получает актуальные slug из того же cache layer.

## Contact form rate limiting

The contact endpoint keeps up to five requests per IP address in a ten-minute
window in the memory of each running application instance. The reverse proxy
must overwrite `x-real-ip`, `cf-connecting-ip`, or `x-forwarded-for`; never
forward a client-supplied value unchanged. Limits reset when the application
restarts and are independent for each deployed instance.

## Meta Pixel and Conversions API

Both are optional and fail open.

- `NEXT_PUBLIC_META_PIXEL_ID` — public Pixel ID. If empty, the snippet is not rendered and browser `fbq` tracks are skipped.
- `META_CAPI_ACCESS_TOKEN` — server-only Graph token. CAPI is skipped unless **both** the pixel ID and this token are set. Graph errors never fail contact, registration, or WayForPay routes.

No test event code is used. When both values are set, Pixel and CAPI share the same `event_id` for deduplication.

## CI

GitHub Actions воспроизводимо запускает frozen install, TypeScript, ESLint с нулём warnings, Vitest, production build, контроль gzip-размера клиентских route chunks и Playwright smoke для обеих локалей.
