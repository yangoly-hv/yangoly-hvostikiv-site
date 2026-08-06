export const donationPurposes = ["foundation", "collection", "tail-one-time", "tail-guardianship"] as const;
export type DonationPurpose = (typeof donationPurposes)[number];

export const donationSchedules = ["oneTime", "monthly"] as const;
export type DonationSchedule = (typeof donationSchedules)[number];

export type DonationTarget = {
  purpose: DonationPurpose;
  targetId?: string;
  targetName?: string;
  amount?: number;
  amountCollected?: number;
};
