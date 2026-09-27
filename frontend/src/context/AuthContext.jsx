import { createContext, useContext, useState } from 'react';
import { api } from '../services/api.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [email, setEmail] = useState(() => localStorage.getItem('admin_email'));

  const login = async (payload) => {
    const data = await api.adminLogin(payload);
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_email', data.email);
    setToken(data.token);
    setEmail(data.email);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setToken(null);
    setEmail(null);
  };

  return <AuthCtx.Provider value={{ token, email, login, logout, isAdmin: Boolean(token) }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
