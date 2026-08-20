

export type DonationIcon = {
    src: string;
    w: number;
    h: number;
    alt: string;
};

// Order mirrors onceValues [100, 200, 600, 1500]:
// day of food, vaccine, bag of food, vet care.
export const onceImages: DonationIcon[] = [
    { src: '/images/donation-form/bone.svg', w: 49, h: 33, alt: "bone" },
    { src: '/images/donation-form/syringe.svg', w: 56, h: 56, alt: "syringe" },
    { src: '/images/donation-form/food.svg', w: 56, h: 56, alt: "food" },
    { src: '/images/donation-form/other.svg', w: 56, h: 56, alt: "care" },
];
