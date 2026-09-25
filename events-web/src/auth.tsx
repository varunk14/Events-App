import {
  createContext, useContext, useEffect, useMemo, useState, ReactNode,
} from 'react';
import { setToken } from './api';
import type { User } from './types';

interface AuthCtx {
  user: User | null;
  token: string | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTok] = useState<string | null>(
    () => localStorage.getItem('token'),
  );
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => { setToken(token); }, [token]);

  const value = useMemo<AuthCtx>(() => ({
    user, token,
    signIn: (t, u) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setTok(t); setUser(u);
    },
    signOut: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTok(null); setUser(null);
    },
  }), [user, token]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
