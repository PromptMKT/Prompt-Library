export type WalletTransaction = {
  id: string;
  transactionType: string;
  amount: number;
  description: string | null;
  createdAt: string;
};

export type WalletSummary = {
  balance: number;
  totalEarned: number;
  totalSpent: number;
};

export type TopUpPackageId = "starter" | "popular" | "pro";

export type ServiceResult<T> = {
  success: boolean;
  message?: string;
  data?: T;
};
