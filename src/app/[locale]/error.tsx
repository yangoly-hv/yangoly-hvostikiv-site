"use client";

import { useLocale } from "next-intl";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  const locale = useLocale();

  return (
    <main className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 text-center text-dark">
      <h1 className="font-arial text-2xl font-black uppercase">
        {locale === "uk" ? "Не вдалося завантажити сторінку" : "Unable to load this page"}
      </h1>
      <p>
        {locale === "uk"
          ? "Спробуйте ще раз — остання збережена версія контенту залишиться доступною після відновлення сервісу."
          : "Please try again. The last saved content remains available after the service recovers."}
      </p>
      <button type="button" onClick={reset} className="rounded-2xl bg-orange px-6 py-3 font-semibold">
        {locale === "uk" ? "Спробувати ще раз" : "Try again"}
      </button>
    </main>
  );
}
