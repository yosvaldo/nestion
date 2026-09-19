export interface BankDetails {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
}

export interface SafeUser {
  id: string;
  email: string;
  fullName: string | null;
  role: "USER" | "TENANT";
  isVerified: boolean;
  avatarUrl: string | null;
}