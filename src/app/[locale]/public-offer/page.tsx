

import { Metadata } from "next";
import { Suspense, useMemo } from "react";
import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import Loading from "@/app/loading";
import { PageParams, IMetadata } from "@/shared/types";

/* =======================
   METADATA
======================= */

export async function generateMetadata({
                                           params,
                                       }: PageParams): Promise<Metadata> {
    const t = await getTranslations("Metadata");
    const metadata = (await t.raw("publicOffer")) as IMetadata;
    const { locale } = await params;

    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://yangoly-hvostikiv.vercel.app";

    return {
        title: metadata.title,
        description: metadata.description,
        openGraph: {
            title: metadata.title,
            description: metadata.description,
            url: `${baseUrl}/${locale}/public-offer`,
            type: "website",
            locale,
        },
    };
}


export default async function PublicOfferPage({ params }: PageParams) {
    const { locale } = await params;

    return (
        <Suspense fallback={<Loading />}>
            <div className="container mx-auto px-4 xl:px-[40px]">
                <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-[60px] mb-[48px] text-center font-arial text-[24px] lg:text-[44px] leading-[130%] uppercase"
                >
                    {locale === "uk"
                        ? "Публічна оферта про надання благодійної пожертви"
                        : "Public Offer for Charitable Donation"}
                </motion.h1>

                <div className="mx-auto max-w-[900px] pb-[120px]">
                    <OfferDocument locale={(locale as "uk" | "en") === "uk" ? "uk" : "en"} />
                </div>
            </div>
        </Suspense>
    );
}

/* ======================================================
   DOCUMENT RENDERER
====================================================== */

function OfferDocument({ locale }: { locale: "uk" | "en" }) {
    const lines = useMemo(() => (locale === "uk" ? UA_LINES : EN_LINES), [locale]);

    // Парсер: заголовки/списки/абзацы (простая надёжная логика)
    const blocks = useMemo(() => parseLines(lines), [lines]);

    return (
        <article className="text-[#1D1D1D]">
            {blocks.map((b, idx) => {
                if (b.type === "title") {
                    return (
                        <motion.h2
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="mt-10 mb-4 text-[20px] font-semibold uppercase tracking-wide"
                        >
                            {b.text}
                        </motion.h2>
                    );
                }

                if (b.type === "subtitle") {
                    return (
                        <motion.p
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="mb-6 text-[16px] leading-[150%] opacity-80 italic"
                        >
                            {b.text}
                        </motion.p>
                    );
                }

                if (b.type === "highlight") {
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="my-6 rounded-xl bg-gray-50 p-6"
                        >
                            {b.paragraphs.map((p, i) => (
                                <P key={i}>{p}</P>
                            ))}
                        </motion.div>
                    );
                }

                if (b.type === "ul") {
                    return (
                        <ul
                            key={idx}
                            className="mb-6 list-disc pl-6 space-y-2 text-[16px] leading-[150%]"
                        >
                            {b.items.map((it, i) => (
                                <li key={i}>{it}</li>
                            ))}
                        </ul>
                    );
                }

                if (b.type === "ol") {
                    return (
                        <ol
                            key={idx}
                            className="mb-6 list-decimal pl-6 space-y-2 text-[16px] leading-[150%]"
                        >
                            {b.items.map((it, i) => (
                                <li key={i}>{it}</li>
                            ))}
                        </ol>
                    );
                }

                return (
                    <P key={idx} className={idx === 0 ? "" : ""}>
                        {b.text}
                    </P>
                );
            })}
        </article>
    );
}

function P({
               children,
               className = "",
           }: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className={`mb-4 text-[16px] leading-[150%] ${className}`}
        >
            {children}
        </motion.p>
    );
}

/* ======================================================
   PARSER
====================================================== */

type Block =
    | { type: "title"; text: string }
    | { type: "subtitle"; text: string }
    | { type: "p"; text: string }
    | { type: "highlight"; paragraphs: string[] }
    | { type: "ul"; items: string[] }
    | { type: "ol"; items: string[] };

function parseLines(lines: readonly string[]): Block[] {
    const blocks: Block[] = [];

    const isAllCapsHeading = (s: string) => {
        // заголовки в доке идут ВЕРХНИМ РЕГИСТРОМ или явно секционные строки
        const trimmed = s.trim();
        if (!trimmed) return false;

        // короткие явные заголовки
        if (
            trimmed === "ПУБЛІЧНА ОФЕРТА" ||
            trimmed === "PUBLIC OFFER" ||
            trimmed === "про надання благодійної пожертви" ||
            trimmed === "for a charitable donation"
        ) {
            return false;
        }

        // если нет букв в нижнем регистре — считаем заголовком
        const hasLower = /[a-zа-яїієґ]/.test(trimmed);
        const hasUpper = /[A-ZА-ЯЇІЄҐ]/.test(trimmed);
        return hasUpper && !hasLower && trimmed.length <= 80;
    };

    // “подзаголовок” сразу после главного заголовка
    const isSubtitle = (s: string) =>
        s.trim() === "про надання благодійної пожертви" ||
        s.trim() === "for a charitable donation";

    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();
        if (!line) {
            i++;
            continue;
        }

        // главный заголовок "ПУБЛІЧНА ОФЕРТА" / "PUBLIC OFFER" выводим как title
        if (line === "ПУБЛІЧНА ОФЕРТА" || line === "PUBLIC OFFER") {
            blocks.push({ type: "title", text: line });
            i++;
            continue;
        }

        if (isSubtitle(line)) {
            blocks.push({ type: "subtitle", text: line });
            i++;
            continue;
        }

        if (isAllCapsHeading(line)) {
            blocks.push({ type: "title", text: line });
            i++;
            continue;
        }

        // списки после строк "Фонд має право:" / "Фонд зобов’язується:" / "Благодійник має право:"
        if (line.endsWith(":")) {
            // выделим такую строку как абзац + начнём собирать список до следующего заголовка
            blocks.push({ type: "p", text: line });
            const items: string[] = [];
            i++;

            while (i < lines.length) {
                const li = lines[i].trim();
                if (!li) {
                    i++;
                    continue;
                }
                if (isAllCapsHeading(li) || li === "Додаток 1" || li === "Appendix 1") break;
                // если вдруг начались нумерованные пункты "1) ..."
                if (/^\d+\)/.test(li)) break;

                items.push(li.replace(/^[•\-]\s*/, ""));
                i++;
            }

            if (items.length) blocks.push({ type: "ul", items });
            continue;
        }

        // нумерованный список 1) 2) ...
        if (/^\d+\)/.test(line)) {
            const items: string[] = [];
            while (i < lines.length) {
                const li = lines[i].trim();
                if (!li) {
                    i++;
                    continue;
                }
                if (!/^\d+\)/.test(li)) break;
                items.push(li.replace(/^\d+\)\s*/, ""));
                i++;
            }
            blocks.push({ type: "ol", items });
            continue;
        }

        // выделяем большие юридические “ключевые” абзацы в подсветку
        // (не обязательно, но делает страницу читабельнее)
        if (
            line.startsWith("Акцептом Оферти Благодійник") ||
            line.startsWith("By accepting the Offer, the Donor") ||
            line.startsWith("Я, Благодійник, що акцептував") ||
            line.startsWith("I, the Donor who has accepted")
        ) {
            const paragraphs: string[] = [line];
            i++;

            // подтянем ещё 1-2 абзаца, если они логически продолжают (без заголовка/списка)
            for (let k = 0; k < 2 && i < lines.length; k++) {
                const next = lines[i]?.trim();
                if (!next) {
                    i++;
                    k--;
                    continue;
                }
                if (
                    isAllCapsHeading(next) ||
                    next.endsWith(":") ||
                    /^\d+\)/.test(next)
                )
                    break;
                paragraphs.push(next);
                i++;
            }

            blocks.push({ type: "highlight", paragraphs });
            continue;
        }

        blocks.push({ type: "p", text: line });
        i++;
    }

    return blocks;
}

/* ======================================================
   FULL CONTENT (UA / EN) — WITHOUT OMISSIONS
====================================================== */

/**
 * UA_LINES — из твоего .docx
 * Разбито построчно ровно по структуре документа
 */
const UA_LINES = [
    "ПУБЛІЧНА ОФЕРТА",
    "про надання благодійної пожертви",
    "Ця публічна оферта про надання благодійної допомоги (надалі - Оферта) спрямована на невизначене коло фізичних осіб (надалі – Благодійники) та є публічною пропозицією Благодійної організації «Благодійний фонд «ЯНГОЛИ ХВОСТИКІВ» (далі – Фонд) укласти договір щодо надання благодійної пожертви на зазначених нижче умовах.",
    "ПОНЯТТЯ ТА ВИЗНАЧЕННЯ",
    "Публічна оферта (та/або Оферта) – дійсна пропозиція Фонду, що розміщена на сайті https://angelsua.org/uk про надання благодійної пожертви, спрямована на невизначене коло фізичних осіб.",
    "Акцепт – повне та безумовне прийняття Оферт шляхом вчинення дій, спрямованих на здійснення грошового переказу за допомогою платіжних форм та засобів, які розміщені на сайті https://angelsua.org/uk, так і шляхом перерахування грошових коштів на поточний рахунок Фонду.",
    "Благодійна пожертва – безоплатна передача Благодійником коштів у власність Фонду для наступного використання для досягнення цілей Фонду, передбачених Статутом або програмами Фонду, відповідно до Закону України «Про благодійну діяльність та благодійні організації» та цього Договору.",
    "Благодійник – дієздатна фізична особа, яка добровільно здійснює один чи декілька видів благодійної пожертви. Для цілей цього Договору Благодійником є фізична особа, яка акцептувала Оферту.",
    "ПРЕДМЕТ ДОГОВОРУ",
    "Предметом цього Договору є безоплатна та добровільна передача Благодійником у власність Фонду грошових коштів шляхом здійснення благодійної пожертви на забезпечення статутної діяльності Фонду, у тому числі, але не виключно, щодо надання Фонду благодійної допомоги відповідно до Закону України «Про благодійну діяльність та благодійні організації», програм Фонду тощо. Благодійник самостійно визначає обсяг благодійної пожертви. Благодійник може визначати напрями використання благодійної пожертви.",
    "Виконання сторонами цього Договору не має на меті отримання прибутку або будь-яких благ для жодної із Сторін.",
    "АКЦЕПТ",
    "Акцептом Оферти Благодійник зазначає, що він згоден з усіма умовами Оферти та розуміє та погоджується з тим, що пожертва буде використана на досягнення цілей, передбачених Статутом Фонду або його програмами, з якими він може ознайомитися, надіславши запит на електронну адресу angelsuaorg@gmail.com. Крім того, Акцептом Оферти Благодійник повною мірою усвідомлює та згоден з предметом Договору, цілями та метою публічного збору коштів, а також підтверджує право Фонду використати частину Благодійної пожертви на адміністративні витрати Фонду у розмірі не більшому, ніж зазначений в Законі України «Про благодійну діяльність та благодійні організації» або інших нормативно-правових актах.",
    "Сторони погоджуються, що з моменту акцептування Оферти, цей Договір є укладеним в письмовій формі відповідно до статей 639, 641 та 642 Цивільного кодексу України та статей 6 та 7 Закону України «Про благодійну діяльність та благодійні організації». При цьому Сторони погоджуються, що після здійснення Акцепту Оферти, неукладення цього Договору у вигляді окремого документа не тягне за собою недійсність цього Договору.",
    "ПРАВА ТА ОБОВ’ЯЗКИ ФОНДУ",
    "Фонд має право:",
    "отримувати Благодійні пожертви та використовувати їх відповідно до предмету та умов цього Договору та своєї статутної діяльності;",
    "за згодою Благодійника змінювати напрями використання благодійної пожертви, якщо Благодійник визначив напрями використання благодійної пожертви;",
    "використовувати частину Благодійної пожертви на адміністративні витрати Фонду у розмірі не більшому, ніж передбачено Законом України «Про благодійну діяльність та благодійні організації» або іншими нормативно-правовими актами;",
    "без погодження з Благодійником змінювати напрями використання пожертви в межах статутної діяльності Фонду у випадку, якщо Благодійник не визначив напрями використання благодійної пожертви.",
    "Фонд зобов’язується:",
    "щорічно в електронному вигляді звітувати про використання Благодійних пожертв шляхом розміщення відповідної інформації на сайті: https://angelsua.org/uk;",
    "використовувати отримані пожертви виключно для досягнення цілей, передбачених статутом Фонду.",
    "ПРАВА БЛАГОДІЙНИКА",
    "Благодійник має право:",
    "здійснювати контроль за використанням Фондом благодійної допомоги за цільовим призначенням.",
    "МІСЦЕ ПРОВЕДЕННЯ ПУБЛІЧНОГО ЗБИРАННЯ КОШТІВ",
    "Публічне збирання коштів Благодійної пожертви здійснюється на території України. Безпосередня діяльність Фонду, що стосується досягнення цілей, передбачених Статутом Фонду, здійснюється на території України (за виключенням тимчасово окупованих територій України та районів проведення активних бойових дій).",
    "СТРОК ЗБИРАННЯ КОШТІВ",
    "Публічний збір коштів триває до моменту припинення діяльності Фонду (в т.ч. шляхом ліквідації), якщо інший строк не буде визначений рішенням Фонду, про ще Благодійник буде повідомлений шляхом розміщення відповідної інформації на сайті Фонду https://angelsua.org/uk.",
    "ПОРЯДОК ВИКОРИСТАННЯ БЛАГОДІЙНОЇ ПОЖЕРТВИ",
    "Використання благодійних пожертв здійснюється відповідно до цілей, визначених Статутом Фонду та чинним законодавством України.",
    "Фонд використовує Благодійні пожертви відповідно до своєї статутної діяльності та програм Фонду. Отримані Фондом Благодійні пожертви можуть бути повернені Благодійнику виключно у випадках, передбачених законодавством України та цим Договором.",
    "У тому випадку, якщо проект, на який Фонд здійснював збір Благодійних пожертв, не буде реалізовано, Фонд змінює напрям використання пожертви шляхом передачі таких коштів на інший проект, в межах статутної діяльності Фонду.",
    "ВІДПОВІДАЛЬНІСТЬ ФОНДУ",
    "Фонд несе відповідальність за порушення умов цього Договору та використання Благодійних пожертв всупереч порядку, передбаченому Статутом Фонду та законодавством України, відповідно до чинного законодавства України.",
    "ПОРЯДОК ЗАГАЛЬНОГО ДОСТУПУ ДО ІНФОРМАЦІЇ ФОНДУ",
    "Фінансова звітність Фонду оприлюднюється шляхом розміщення на сайті Фонду щорічно до 01 березня року, наступного за звітним.",
    "Інша інформація розкривається Фондом в порядку та в обсягах, передбачених законодавством України.",
    "Витрати, пов’язані з перерахуванням Благодійних пожертв (комісії за перерахування коштів, податки, збори тощо) несе Благодійник.",
    "Шляхом акцептування Оферти Благодійник підтверджує, що він ознайомлений з Додатком 1 до цього Договору та надає свою згоду на збір, обробку та використання персональних даних в порядку, передбаченому Додатком 1 до цього Договору та чинним законодавством України.",
    "Благодійник надає згоду на те, що після внесення інформації про себе на сайті Фонду та здійснення реєстрації на сайті, його контактна інформація може бути використана Фондом для направлення листів та повідомлень, в тому числі в електронному вигляді. При цьому Фонд зобов’язується не надавати інформацію про контактні дані Благодійника третім особам, крім випадків, прямо передбачених законодавством України. Крім того, Благодійник надає свою згоду, що інформацію про нього (зокрема, прізвище, ім’я, по-батькові) може бути використано Фондом в засобах масової інформації або на сайті Фонду виключно за його додатковою згодою.",
    "Додаток 1",
    "до Публічної оферти про надання благодійної пожертви",
    "ЗГОДА-ПОВІДОМЛЕННЯ",
    "на збір, обробку та використання персональних даних",
    "Я, Благодійник, що акцептував Публічну оферту про надання благодійної допомоги, відповідно до вимог Закону України «Про захист персональних даних» свідомо та добровільно надаю Благодійній організації «Благодійний фонд «ЯНГОЛИ ХВОСТИКІВ» (далі – Фонд) свою згоду на автоматизовану, а також без використання засобів автоматизації обробку (включаючи збирання, накопичення, зберігання та використання) моїх персональних даних, а саме: прізвище, ім’я, по батькові, паспортні дані, реєстраційний номер облікової картки платника податків, фотографія або інший запис зображення, номер засобів зв’язку, адреса електронної пошти, дані щодо місця проживання, інші дані, добровільно надані мною для реалізації мети обробки, - з метою забезпечення реалізації цивільно-правових та господарсько-правових відносин, адміністративно-правових, податкових відносин, відносин у сфері бухгалтерського обліку, відносин у сфері статистики, та забезпечення реалізації інших відносин, що вимагають обробки персональних даних відповідно до Цивільного кодексу України, Податкового кодексу України, закону України «Про благодійну діяльність та благодійні організації», інших нормативно-правових актів України, Статуту Фонду.",
    "Цим документом я також надаю згоду на передачу (поширення) своїх персональних даних виключно з вказаною вище метою та у порядку, визначеному Законом України «Про захист персональних даних» та локальними актами Фонду, які встановлюють порядок обробки та захисту персональних даних. Я не вимагаю здійснення повідомлення про передачу (поширення) моїх персональних даних третім особам, якщо така передача (поширення) відбувається в моїх інтересах з метою реалізації вказаних вище правовідносин.",
    "Підписанням даної згоди-повідомлення підтверджую, що я письмово повідомлений (-на) про цілі обробки персональних даних (згідно вказаної у цьому документі мети) та осіб, яким передаються мої персональні дані. А також про свої права, передбачені ст. 8 Закону України «Про захист персональних даних», згідно з якою суб’єкт персональних даних має право:",
    "1) знати про джерела збирання, місцезнаходження своїх персональних даних, мету їх обробки, місцезнаходження або місце проживання (перебування) володільця чи розпорядника персональних даних або дати відповідне доручення щодо отримання цієї інформації уповноваженим ним особам, крім випадків, встановлених законом;",
    "2) отримувати інформацію про умови надання доступу до персональних даних, зокрема інформацію про третіх осіб, яким передаються його персональні дані;",
    "3) на доступ до своїх персональних даних;",
    "4) отримувати не пізніш як за тридцять календарних днів з дня надходження запиту, крім випадків, передбачених законом, відповідь про те, чи обробляються його персональні дані, а також отримувати зміст таких персональних даних;",
    "5) пред’являти вмотивовану вимогу володільцю персональних даних із запереченням проти обробки своїх персональних даних;",
    "6) пред'являти вмотивовану вимогу щодо зміни або знищення своїх персональних даних будь-яким володільцем та розпорядником персональних даних, якщо ці дані обробляються незаконно чи є недостовірними;",
    "7) на захист своїх персональних даних від незаконної обробки та випадкової втрати, знищення, пошкодження у зв'язку з умисним приховуванням, ненаданням чи несвоєчасним їх наданням, а також на захист від надання відомостей, що є недостовірними чи ганьблять честь, гідність та ділову репутацію фізичної особи;",
    "8) звертатися із скаргами на обробку своїх персональних даних до Уповноваженого або до суду;",
    "9) застосовувати засоби правового захисту в разі порушення законодавства про захист персональних даних;",
    "10) вносити застереження стосовно обмеження права на обробку своїх персональних даних під час надання згоди;",
    "11) відкликати згоду на обробку персональних даних;",
    "12) знати механізм автоматичної обробки персональних даних;",
    "13) на захист від автоматизованого рішення, яке має для нього правові наслідки.",
    "Ця згода-повідомлення діє протягом невизначеного терміну.",
] as const;

/**
 * EN_LINES — полный перевод всех строк UA_LINES.
 * (Структура 1-в-1, чтобы парсер красиво отрисовал разделы и списки.)
 */
const EN_LINES = [
    "PUBLIC OFFER",
    "for a charitable donation",
    "This public offer for providing charitable assistance (hereinafter referred to as the “Offer”) is addressed to an indefinite number of individuals (hereinafter referred to as “Donors”) and constitutes a public proposal of the Charitable Organization “Charitable Foundation “ANGELS OF TAILS” (hereinafter the “Foundation”) to conclude an agreement on making a charitable donation under the terms set forth below.",
    "DEFINITIONS",
    "Public offer (and/or Offer) means a valid offer of the Foundation published on the website https://angelsua.org/uk to make a charitable donation, addressed to an indefinite number of individuals.",
    "Acceptance means full and unconditional acceptance of the Offer by performing actions aimed at making a monetary transfer using the payment forms and methods available on the website https://angelsua.org/uk, as well as by transferring funds to the Foundation’s current bank account.",
    "Charitable donation means a gratuitous transfer by the Donor of funds into the ownership of the Foundation for subsequent use to achieve the Foundation’s purposes stipulated by the Charter or programs of the Foundation, in accordance with the Law of Ukraine “On Charitable Activities and Charitable Organizations” and this Agreement.",
    "Donor means a legally capable individual who voluntarily makes one or more types of charitable donation. For the purposes of this Agreement, a Donor is an individual who has accepted the Offer.",
    "SUBJECT OF THE AGREEMENT",
    "The subject of this Agreement is the gratuitous and voluntary transfer by the Donor into the ownership of the Foundation of funds by making a charitable donation to support the statutory activities of the Foundation, including, but not limited to, providing charitable assistance to the Foundation in accordance with the Law of Ukraine “On Charitable Activities and Charitable Organizations”, the Foundation’s programs, etc. The Donor independently determines the amount of the charitable donation. The Donor may specify the intended use of the charitable donation.",
    "The performance of this Agreement by the Parties does not aim to generate profit or any benefits for either Party.",
    "ACCEPTANCE",
    "By accepting the Offer, the Donor confirms that they agree with all terms of the Offer and understand and accept that the donation will be used to achieve the purposes set forth in the Foundation’s Charter or its programs, which the Donor may review by sending a request to the email address angelsuaorg@gmail.com. In addition, by accepting the Offer, the Donor fully understands and agrees with the subject matter of the Agreement, the goals and purpose of the public fundraising, and also confirms the Foundation’s right to use a portion of the charitable donation for the Foundation’s administrative expenses in an amount not exceeding that specified in the Law of Ukraine “On Charitable Activities and Charitable Organizations” or other regulatory legal acts.",
    "The Parties agree that from the moment of acceptance of the Offer, this Agreement is concluded in written form in accordance with Articles 639, 641 and 642 of the Civil Code of Ukraine and Articles 6 and 7 of the Law of Ukraine “On Charitable Activities and Charitable Organizations”. The Parties also agree that after the Offer is accepted, failure to execute this Agreement as a separate document does not entail the invalidity of this Agreement.",
    "FOUNDATION RIGHTS AND OBLIGATIONS",
    "The Foundation has the right to:",
    "receive charitable donations and use them in accordance with the subject matter and terms of this Agreement and its statutory activities;",
    "with the Donor’s consent, change the intended use of the charitable donation if the Donor has specified such intended use;",
    "use a portion of the charitable donation for the Foundation’s administrative expenses in an amount not exceeding that provided by the Law of Ukraine “On Charitable Activities and Charitable Organizations” or other regulatory legal acts;",
    "without the Donor’s consent, change the intended use of the donation within the Foundation’s statutory activities if the Donor has not specified the intended use of the charitable donation.",
    "The Foundation undertakes to:",
    "annually, in electronic form, report on the use of charitable donations by publishing relevant information on the website: https://angelsua.org/uk;",
    "use the received donations exclusively to achieve the purposes provided for by the Foundation’s Charter.",
    "DONOR RIGHTS",
    "The Donor has the right to:",
    "monitor the Foundation’s use of charitable assistance for its intended purpose.",
    "PLACE OF PUBLIC FUNDRAISING",
    "Public fundraising of charitable donations is carried out on the territory of Ukraine. The Foundation’s direct activities related to achieving the purposes provided for in the Foundation’s Charter are carried out on the territory of Ukraine (except for the temporarily occupied territories of Ukraine and areas of active hostilities).",
    "FUNDRAISING PERIOD",
    "Public fundraising continues until the Foundation’s activity is terminated (including by liquidation), unless another period is determined by the Foundation’s decision, of which the Donor will be informed by publishing relevant information on the Foundation’s website https://angelsua.org/uk.",
    "PROCEDURE FOR USING CHARITABLE DONATIONS",
    "Charitable donations are used in accordance with the purposes defined by the Foundation’s Charter and the current legislation of Ukraine.",
    "The Foundation uses charitable donations in accordance with its statutory activities and the Foundation’s programs. Charitable donations received by the Foundation may be returned to the Donor only in cases предусмотрені by the legislation of Ukraine and this Agreement.",
    "If the project for which the Foundation raised charitable donations is not implemented, the Foundation changes the intended use of the donation by transferring such funds to another project within the Foundation’s statutory activities.",
    "FOUNDATION LIABILITY",
    "The Foundation is liable for violation of the terms of this Agreement and for the use of charitable donations contrary to the procedure provided for by the Foundation’s Charter and the legislation of Ukraine, in accordance with the current legislation of Ukraine.",
    "PROCEDURE FOR PUBLIC ACCESS TO FOUNDATION INFORMATION",
    "The Foundation’s financial statements are published annually on the Foundation’s website by March 1 of the year following the reporting year.",
    "Other information is disclosed by the Foundation in the manner and scope предусмотрені by the legislation of Ukraine.",
    "Expenses related to transferring charitable donations (transfer fees, taxes, charges, etc.) are borne by the Donor.",
    "By accepting the Offer, the Donor confirms that they have reviewed Appendix 1 to this Agreement and give their consent to the collection, processing and use of personal data in the manner provided for by Appendix 1 to this Agreement and the current legislation of Ukraine.",
    "The Donor consents that after providing information about themselves on the Foundation’s website and registering on the website, their contact information may be used by the Foundation to send letters and notifications, including in electronic form. The Foundation undertakes not to provide information about the Donor’s contact details to third parties, except in cases explicitly provided for by law. In addition, the Donor consents that information about them (in particular, surname, name, patronymic) may be used in mass media or on the Foundation’s website only with their additional consent.",
    "Appendix 1",
    "to the Public Offer for making a charitable donation",
    "CONSENT NOTICE",
    "for the collection, processing and use of personal data",
    "I, the Donor who has accepted the Public Offer for providing charitable assistance, in accordance with the Law of Ukraine “On Personal Data Protection”, knowingly and voluntarily give my consent to the Charitable Organization “Charitable Foundation “ANGELS OF TAILS” (hereinafter the “Foundation”) to automated and also non-automated processing (including collection, accumulation, storage and use) of my personal data, namely: surname, name, patronymic, passport details, taxpayer identification number, photograph or other image record, contact phone number, email address, place of residence data, other data voluntarily provided by me for the purpose of processing — for the purpose of ensuring the implementation of civil-law and commercial-law relations, administrative-law relations, tax relations, accounting relations, statistical relations, and ensuring the implementation of other relations requiring the processing of personal data in accordance with the Civil Code of Ukraine, the Tax Code of Ukraine, the Law of Ukraine “On Charitable Activities and Charitable Organizations”, other regulatory legal acts of Ukraine, and the Foundation’s Charter.",
    "By this document, I also give my consent to the transfer (disclosure/dissemination) of my personal data solely for the purpose stated above and in the manner prescribed by the Law of Ukraine “On Personal Data Protection” and the Foundation’s internal acts which establish the procedure for processing and protecting personal data. I do not require notification about the transfer (disclosure/dissemination) of my personal data to third parties if such transfer (disclosure/dissemination) occurs in my interests for the purpose of implementing the legal relations specified above.",
    "By signing this consent notice, I confirm that I have been informed in writing about the purposes of personal data processing (according to the purpose stated herein) and about the persons to whom my personal data is transferred. I also confirm that I have been informed about my rights provided for by Article 8 of the Law of Ukraine “On Personal Data Protection”, according to which a personal data subject has the right to:",
    "1) know the sources of collection, the location of their personal data, the purpose of processing, the location or place of residence (stay) of the controller or processor of personal data, or authorize representatives to obtain such information, except in cases established by law;",
    "2) receive information about the conditions for granting access to personal data, including information about third parties to whom their personal data is transferred;",
    "3) access their personal data;",
    "4) receive, no later than thirty calendar days from the date of receipt of the request, except in cases provided by law, a response as to whether their personal data is processed, and also receive the content of such personal data;",
    "5) submit a reasoned request to the controller with an objection to the processing of their personal data;",
    "6) submit a reasoned request to change or delete their personal data by any controller or processor if such data is processed unlawfully or is inaccurate;",
    "7) protect their personal data from unlawful processing and accidental loss, destruction or damage due to intentional concealment, failure to provide or untimely provision thereof, as well as protection against providing information that is inaccurate or damages the honor, dignity and business reputation of an individual;",
    "8) file complaints regarding the processing of their personal data with the Authorized Person (Data Protection Authority) or with a court;",
    "9) use legal remedies in case of violation of personal data protection legislation;",
    "10) make reservations regarding the limitation of the right to process their personal data when giving consent;",
    "11) withdraw consent to the processing of personal data;",
    "12) know the mechanism of automated processing of personal data;",
    "13) be protected from an automated decision that has legal consequences for them.",
    "This consent notice is valid for an indefinite period.",
] as const;
