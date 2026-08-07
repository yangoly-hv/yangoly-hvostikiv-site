export type MonobankJar = {
  id: string;
  sendId: string;
  title: string;
  description?: string;
  currencyCode: number;
  balance: number;
  goal?: number;
};

export type MonobankClientInfo = {
  jars?: MonobankJar[];
};

export type MonobankJarStatus = {
  title: string;
  balanceUah: number;
  goalUah: number | null;
  jarUrl: string;
  sendId: string;
};
