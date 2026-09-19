import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import axios from "axios";
import { api, setAccessToken } from "../configs/api.config";

export interface BankDetails {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
}

export interface User {
  id: string;
  email: string;
  role: "USER" | "TENANT";
  isVerified: boolean;
  fullName?: string;
  avatarUrl?: string;
}

export interface RegisterPayload {
    email: string;
    role: "USER" | "TENANT";
    bankDetails?: BankDetails;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  signUp: (data: RegisterPayload, onSuccess?: () => void) => Promise<void>;
  login: (data: { email: string; password: string }, onSuccess?: () => void) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User | null, token: string | null) => void;
  setUser: (user: User | null) => void;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallback;
};

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,

            setAuth: (user, accessToken) => {
                setAccessToken(accessToken);
                set({ user, accessToken });
            },

            setUser: (user) => set({ user }),
        
            signUp: async (data, onSuccess) => {
                try {
                    await api.post("/auth/sign-up", data);
                    toast.success("Registrasi berhasil. Silahkan periksa email Anda untuk verifikasi.");
                    if (onSuccess) onSuccess();
                } catch (error: unknown) {
                    toast.error(getErrorMessage(error, "Gagal melakukan registrasi."));
                }
            },
            
            login: async (data, onSuccess) => {
                try {
                    const response = await api.post("/auth/sign-in", data);
                    const { accessToken, user } = response.data.data || {};

                    setAccessToken(accessToken || null);
                    set({ user: user || null, accessToken: accessToken || null });

                    toast.success("Berhasil masuk!");
                    if (onSuccess) onSuccess();
                } catch (error: unknown) {
                    toast.error(getErrorMessage(error, "Email atau password salah."));
                }
            },

            logout: async () => {
                try {
                    await api.post("/auth/sign-out");
                } catch (error: unknown) {
                    console.error("Logout error:", error);
                } finally {
                    setAccessToken(null);
                    set({ user: null, accessToken: null });
                    toast.success("Berhasil keluar");
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
            }),
        }
    )
);

export default useAuthStore;