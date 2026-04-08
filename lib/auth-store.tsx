"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthResult {
  ok: boolean;
  message: string;
}

interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAuthHydrated: boolean;
  login: (email: string, password: string) => AuthResult;
  register: (name: string, email: string, password: string) => AuthResult;
  logout: () => void;
}

const registeredUsersKey = "proposalflow:registered-users";
const currentSessionKey = "proposalflow:current-session";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep auth UI usable even if localStorage is unavailable.
  }
}

function removeStorage(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // No-op when localStorage is unavailable.
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toSessionUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function createUserId() {
  return `USER-${Date.now().toString(36).toUpperCase()}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [registeredUsers, setRegisteredUsers] = useState<StoredUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthHydrated, setIsAuthHydrated] = useState(false);

  useEffect(() => {
    setRegisteredUsers(readStorage(registeredUsersKey, []));
    setCurrentUser(readStorage(currentSessionKey, null));
    setIsAuthHydrated(true);
  }, []);

  useEffect(() => {
    if (!isAuthHydrated) {
      return;
    }

    writeStorage(registeredUsersKey, registeredUsers);
  }, [isAuthHydrated, registeredUsers]);

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const normalizedEmail = normalizeEmail(email);

      if (!normalizedEmail || !password) {
        return { ok: false, message: "Enter your email and password." };
      }

      if (!isValidEmail(normalizedEmail)) {
        return { ok: false, message: "Enter a valid email address." };
      }

      const user = registeredUsers.find((item) => item.email === normalizedEmail);

      if (!user || user.password !== password) {
        return { ok: false, message: "Email or password is incorrect." };
      }

      const sessionUser = toSessionUser(user);
      setCurrentUser(sessionUser);
      writeStorage(currentSessionKey, sessionUser);

      return { ok: true, message: "Signed in successfully." };
    },
    [registeredUsers],
  );

  const register = useCallback(
    (name: string, email: string, password: string): AuthResult => {
      const normalizedName = name.trim();
      const normalizedEmail = normalizeEmail(email);

      if (!normalizedName || !normalizedEmail || !password) {
        return { ok: false, message: "Complete your name, email, and password." };
      }

      if (!isValidEmail(normalizedEmail)) {
        return { ok: false, message: "Enter a valid email address." };
      }

      if (password.length < 8) {
        return { ok: false, message: "Password must be at least 8 characters." };
      }

      const duplicateUser = registeredUsers.some((user) => user.email === normalizedEmail);

      if (duplicateUser) {
        return { ok: false, message: "An account with this email already exists." };
      }

      const user: StoredUser = {
        id: createUserId(),
        name: normalizedName,
        email: normalizedEmail,
        password,
      };
      const sessionUser = toSessionUser(user);

      setRegisteredUsers((current) => [user, ...current]);
      setCurrentUser(sessionUser);
      writeStorage(currentSessionKey, sessionUser);

      return { ok: true, message: "Account created successfully." };
    },
    [registeredUsers],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    removeStorage(currentSessionKey);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isAuthHydrated,
      login,
      register,
      logout,
    }),
    [currentUser, isAuthHydrated, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
