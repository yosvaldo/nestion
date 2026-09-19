import useAuthStore from "@/stores/authStore";

export const useAuth = () => {
  const { user, accessToken } = useAuthStore();
  
  return {
    user,
    token: accessToken,
    isAuthenticated: !!user,
    isLoading: false,
  };
};