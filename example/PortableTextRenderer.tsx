"use client";

import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import { BlogContent } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import MainButton from "../buttons/MainButton";
import SecondaryButton from "../buttons/SecondaryButton";

const components: Partial<PortableTextReactComponents> = {
  block: {
   normal: (props) => {
    // Приводимо children до тексту
    const text = Array.isArray(props.children)
      ? props.children.join('').trim()
      : String(props.children || '').trim();

    // Якщо текст пустий — нічого не рендеримо
    if (!text) return null;

    return (
      <motion.p
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="text-[16px] font-light leading-[150%]"
      >
        {props.children}
      </motion.p>
    );
  },
    h1: (props) => (
      <motion.h1
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="font-actay text-[24px] lg:text-[32px] font-bold leading-none"
      >
        {props.children}
      </motion.h1>
    ),
    h2: (props) => (
      <motion.h2
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="font-actay text-[24px] lg:text-[32px] font-bold leading-none"
      >
        {props.children}
      </motion.h2>
    ),
    blockquote: (props) => (
      <motion.blockquote
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="border-l-4 border-main pl-4 italic"
      >
        {props.children}
      </motion.blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const blank = value?.blank || false;

      return (
        <Link
          href={href}
          target={blank ? "_blank" : undefined}
          rel={blank ? "noopener noreferrer" : undefined}
          className="inline-block min-w-[235px]"
        >
          <SecondaryButton variant="white" className="h-12">
            {children}
          </SecondaryButton>
        </Link>
      );
    },
  },
  list: {
    bullet: (props) => (
      <motion.ul
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="flex flex-col gap-5 list-disc pl-6 space-y-2"
      >
        {props.children}
      </motion.ul>
    ),
    number: (props) => (
      <motion.ol
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="flex flex-col gap-5 list-decimal pl-6 space-y-2"
      >
        {props.children}
      </motion.ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const ref = value?.asset?._ref;
      const url = value?.asset?.url;

      if (!ref && !url) return null;

      // якщо є вже готовий URL — використовуємо його
      let imageUrl = url;

      // якщо лише _ref — будуємо шлях вручну
      if (!imageUrl && ref) {
        const [, id, dimensions, format] = ref.split("-");
        imageUrl = `https://cdn.sanity.io/images/vh20xg14/production/${id}-${dimensions}.${format}`;
      }

      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInAnimation({ y: 20 })}
          className="relative flex justify-center h-[368px] rounded-[8px]"
        >
          <Image
            src={imageUrl}
            alt={value?.alt || ""}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover rounded-[8px]"
          />
        </motion.div>
      );
    },
  },
};

export default function PortableTextRenderer({
  value,
}: {
  value?: BlogContent;
}) {
  // 🧠 Безпечна перевірка, щоб не зламалося, якщо контент порожній
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  return <PortableText value={value} components={components} />;
}
