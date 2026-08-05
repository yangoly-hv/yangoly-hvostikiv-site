
import type { PortableTextComponents } from "@portabletext/react";

import { getSafeHref, isExternalWebHref } from "@/shared/lib/safeHref";

export const portableTextComponents: PortableTextComponents = {
    block: {
        normal: ({ children }) => (
            <p className="mb-4 text-gray-800 leading-relaxed last:mb-0">
                {children}
            </p>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-2 last:mb-0">
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-2 last:mb-0">
                {children}
            </ul>
        ),
    },
    listItem: {
        bullet: ({ children }) => (
            <li className="pl-1">
                {children}
            </li>
        ),
        number: ({ children }) => (
            <li className="pl-1">
                {children}
            </li>
        ),
    },
    marks: {
        strong: ({ children }) => (
            <strong className="font-semibold">
                {children}
            </strong>
        ),
        link: ({ value, children }) => {
            const href = getSafeHref(value?.href)
            if (!href) return <>{children}</>

            const isExternal = isExternalWebHref(href)
            return (
                <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="border-b border-green text-green transition-colors hover:text-[#3f6656]"
                >
                    {children}
                </a>
            )
        },
    },
}
