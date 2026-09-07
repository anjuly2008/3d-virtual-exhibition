import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { api, setToken } from '@/api/client';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('token');

    if (saved) {
      setToken(saved);

      api.auth
        .me()
        .then((data) => setUser(data.user))
        .catch(() => {
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.auth.login(email, password);
      setToken(data.token);
      setUser(data.user);
    },
    []
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await api.auth.register(username, email, password);
      setToken(data.token);
      setUser(data.user);
    },
    []
  );

  const updateAvatar = useCallback(
  async (file: File) => {
    const data = await api.auth.updateAvatar(file);
    setUser(data.user);
  },
  []
);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, updateAvatar, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}