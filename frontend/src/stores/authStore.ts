import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import axios from "axios";
import { api, setAccessToken } from "../configs/api.config";

export interface User {
  id: string;
  email: string;
  role: "USER" | "TENANT";
  isVerified: boolean;
  name?: string;
  avatar?: string;
}

export interface RegisterPayload {
    email: string;
    role: "USER" | "TENANT";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  signUp: (data: RegisterPayload, onSuccess?: () => void) => Promise<void>;
  login: (data: { email: string; password: string }, onSuccess?: () => void) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User | null, token: string | null) => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,

            setAuth: (user, accessToken) => {
                setAccessToken(accessToken);
                set({ user, accessToken });
            },
        
            signUp: async (data, onSuccess) => {
                try {
                    const endpoint = data.role === "TENANT" ? "/auth/tenant/register" : "/auth/register";
                    await api.post(endpoint, data);
                    toast.success("Registrasi berhasil. Silahkan periksa email Anda untuk verifikasi.");
                    if (onSuccess) onSuccess();
                } catch (error: unknown) {
                    let message = "Gagal melakukan registrasi.";
                    if (axios.isAxiosError(error) && error.response?.data?.message) {
                        message = error.response.data.message;
                    }
                    toast.error(message);
                }
            },
            
            login: async (data, onSuccess) => {
                try {
                    const response = await api.post("/auth/login", data);
                    const { accessToken, user } = response.data.data || {};

                    setAccessToken(accessToken || null);
                    set({ user: user || null, accessToken: accessToken || null });

                    toast.success("Berhasil masuk!");
                    if (onSuccess) onSuccess();
                } catch (error: unknown) {
                    let message = "Email atau password salah.";
                    if (axios.isAxiosError(error) && error.response?.data?.message) {
                        message = error.response.data.message;
                    }
                    toast.error(message);
                }
            },

            logout: async () => {
                try {
                    await api.post("/auth/logout");
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
            }),
        }
    )
);

export default useAuthStore;