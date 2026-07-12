import {PortableText} from '@portabletext/react'

import {portableTextComponents} from './portableTextComponents'

function HelpTabCard({title,
                         description,
                         cta,
                         iconSrc,
                         isActive,
                         onClick,
                     }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick()
        }
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            aria-pressed={isActive}
            className={`z-10 relative group w-full overflow-hidden rounded-2xl border-2 border-[#4C7B67] text-left transition`}
        >
            {/* TOP */}
            <div className="flex flex-wrap lg:flex-nowrap gap-4 p-[20px] bg-white ">
                {/* ICON */}

                {/*<Image*/}
                {/*    width={97}*/}
                {/*    height={97}*/}
                {/*    src={iconSrc}*/}
                {/*    alt={title}*/}
                {/*    className="object-contain"*/}

                {/*/>*/}
                <div className="w-8 h-8 lg:w-[97px] lg:h-[97px] flex items-center justify-center shrink-0">
                    <img src={iconSrc} alt={title} className="w-full h-full object-contain"/>
                </div>

                {/* TEXT */}
                <div>
                    <h3 className="mb-[12px] text-[20px] lg:text-[24px] font-semibold">
                        {title}
                    </h3>
                    <div className="hidden sm:block text-[14px] leading-[130%]">
                        <PortableText value={description} components={portableTextComponents} />
                    </div>
                </div>
                <div className="w-full sm:hidden text-[14px] leading-[130%]">
                    <PortableText value={description} components={portableTextComponents} />
                </div>
            </div>

            {/* CTA */}
            <div
                className={`flex items-center justify-between gap-2 px-6 py-[3px] text-[14px] lg:text-[18px] transition
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
        </div>
    )
}

export default HelpTabCard;
