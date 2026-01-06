import Link from "next/link";

const PublicOfferLink = ({text}: {text: string})=> {
    if(text.includes("договором")) {
        return (
            <>
                Я ознайомився/лась із{" "}
                <Link
                    target="_blank"
                    href="/public-offer"
                    className="text-blue-600 underline hover:no-underline"
                >
                    договором публічної оферти
                </Link>{" "}
                щодо надання благодійної пожертви та згоден/згодна на збір, обробку та
                використання персональних даних, згідно з умовами цього договору.
            </>
        )
    }
    return (
        <>
            I have read and agree to the{" "}
            <Link
                target="_blank"
                href="/public-offer"
                className="text-blue-600 underline hover:no-underline"
            >
                public offer agreement
            </Link>{" "}
            for charitable donations and consent to the collection, processing, and
            use of personal data according to the terms of this agreement.
        </>
    )
}

export default PublicOfferLink;
