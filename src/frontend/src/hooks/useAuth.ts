import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export interface AuthState {
  isAuthenticated: boolean;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const { login, clear, isLoginSuccess, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoading = !isLoginSuccess && !isAuthenticated;
  const principal = identity ? identity.getPrincipal().toString() : null;

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        throw error;
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    localStorage.removeItem("fourthspace_tenant_id");
    localStorage.removeItem("fourthspace_workspace_id");
  };

  return {
    isAuthenticated,
    principal,
    login: handleLogin,
    logout: handleLogout,
    isLoading,
  };
}
