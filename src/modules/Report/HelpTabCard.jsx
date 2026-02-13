import Image from 'next/image'

function HelpTabCard({title,
                         description,
                         cta,
                         iconSrc,
                         isActive,
                         onClick,
                     }) {
    return (
        <button
            onClick={onClick}
            className={`group w-full overflow-hidden rounded-2xl border-2 border-[#4C7B67] text-left transition`}
        >
            {/* TOP */}
            <div className="flex items-center gap-4 p-[20px] bg-white ">
                {/* ICON */}

                    <Image
                        width={97}
                        height={97}
                        src={iconSrc}
                        alt={title}
                        className="object-contain"

                    />


                {/* TEXT */}
                <div>
                    <h3 className="mb-[12px] text-[20px] lg:text-[24px] font-semibold">
                        {title}
                    </h3>
                    <p className="text-[14px] leading-[130%]">
                        {description}
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div
                className={`flex items-center justify-between gap-2 px-6 py-[1px] text-lg transition
          ${isActive
                    ? 'bg-[#4C7B67] text-white'
                    : 'bg-[#4C7B67] text-white group-hover:bg-[#4C7B67]/90'
                }
        `}
            >
                <span></span>
                {cta}
                <span className="transition group-hover:translate-x-1"> &gt; </span>
            </div>
        </button>
    )
}

export default HelpTabCard;
