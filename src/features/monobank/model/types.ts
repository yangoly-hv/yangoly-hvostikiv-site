/** Public jar payload from GET /bank/jar/{longJarId}. */
export type MonobankPublicJar = {
  jarId: string;
  title: string;
  /** Collected amount in kopiyky. */
  amount: number;
  /** Goal in kopiyky when set. */
  goal?: number;
};

export type MonobankJarStatus = {
  title: string;
  balanceUah: number;
  goalUah: number | null;
  jarUrl: string;
  sendId: string;
};
