'use client' // Error boundaries must be Client Components

import { useParams } from 'next/navigation'
import NotFoundLocale from "@/shared/components/NotFoundLocale/NotFoundLocale";

export default function Error() {

    const {locale} = useParams<{ locale: string}>();

    return (
        <NotFoundLocale locale={locale} />
    )
}
