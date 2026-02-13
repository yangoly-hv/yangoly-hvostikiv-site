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
            <div className="flex gap-4 p-[20px] bg-white">
                {/* ICON */}
                <div
                    className="flex h-[97px] w-[97px] min-w-[97px] min-h-[97px] items-center justify-center rounded-xl bg-[#4C7B67]/10">
                    <Image
                        src={iconSrc}
                        alt=""
                        width={80}
                        height={80}
                        className="object-contain block"
                        priority={false}
                    />
                </div>

                {/* TEXT */}
                <div>
                    <h3 className="mb-[12px] text-[24px] font-semibold">
                        {title}
                    </h3>
                    <p className="text-[14px] leading-[130%]">
                        {description}
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div
                className={`flex items-center justify-end gap-2 px-6 py-[7px] text-lg transition
          ${isActive
                    ? 'bg-[#4C7B67] text-white'
                    : 'bg-[#4C7B67] text-white group-hover:bg-green-700'
                }
        `}
            >
                {cta}
                <span className="transition group-hover:translate-x-1"> &gt; </span>
            </div>
        </button>
    )
}

export default HelpTabCard;
