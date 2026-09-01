import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setToken } from '@/api/client';

interface AuthUser {//定义类型
  //告诉 TS： 一个用户对象应该长什么样
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {//整个登录系统对外提供哪些东西。
  //这个登录系统允许别人使用哪些功能
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);//createContext 这是 React 自带函数 创建一个“共享数据通道”。

export function AuthProvider({ children }: { children: React.ReactNode }) {//往Context里面放数据
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      setToken(saved);
      api.auth.me()
        .then((data) => setUser(data.user))
        .catch(() => { setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);//[]告诉react这个函数依赖哪些外部变量？useCallback可以让函数引用在依赖不变的时候保持稳定。

    //用户输入邮箱密码以后，我调用后端登录接口；后端返回 Token 和用户信息；我把 Token 保存起来，再把用户信息保存到 React 状态中。
  const login = useCallback(async (email: string, password: string) => {//useCallback，React，帮我记住这个函数。
    const data = await api.auth.login(email, password);//调用api.auth.login()
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const data = await api.auth.register(username, email, password);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>//Provider是React提供的组件 把这些东西存进去
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {//React 自带 从Context里面取数据
  const ctx = useContext(AuthContext);//获取数据
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}