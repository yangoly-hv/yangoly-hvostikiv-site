'use client'

import { PortableText } from '@portabletext/react'

export default function PortableTextRenderer({ value }) {
    return value ? <PortableText value={value} /> : null
}
