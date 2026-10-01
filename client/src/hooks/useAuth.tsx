import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (
    user: AuthUser,
    token: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem("accessToken")
    );

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function restoreUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid session");
        }

        const data = await response.json();

        setUser(data.user);
      } catch {
        localStorage.removeItem("accessToken");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreUser();
  }, [token]);

  function login(
    user: AuthUser,
    token: string
  ) {
    setUser(user);
    setToken(token);

    localStorage.setItem(
      "accessToken",
      token
    );
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem(
      "accessToken"
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}