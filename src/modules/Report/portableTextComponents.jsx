
export const portableTextComponents = {
    block: {
        normal: ({ children }) => (
            <p className="mb-4 text-gray-800 leading-relaxed">
                {children}
                </p>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-2">
                {children}
                </ul>
        ),
    },
    marks: {
        link: ({ value, children }) => (
            <a
                href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-700 underline hover:text-green-800"
        >
        {children}
        </a>
),
},
}
