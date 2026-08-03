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

Filter: `_type in ["post", "tail", "reports", "donator", "collection", "perfomance", "aboutFoundation", "events"]`. Drafts и versions в настройках webhook должны быть выключены.

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

## Статические маршруты и локализация

Build генерирует `uk` и `en`, статические контентные маршруты и все существующие blog/tail/report slug. `next-intl` использует единственные словари `public/messages/{locale}.json`. Locale проверяется в root locale layout, а `setRequestLocale` вызывается во всех страницах. Canonical, Open Graph и alternate locales собираются централизованно; sitemap получает актуальные slug из того же cache layer.

## CI

GitHub Actions воспроизводимо запускает frozen install, TypeScript, ESLint с нулём warnings, Vitest, production build, контроль gzip-размера клиентских route chunks и Playwright smoke для обеих локалей.
