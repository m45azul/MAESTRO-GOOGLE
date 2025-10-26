import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../types';
import { userMap } from '../data/users';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userId: string) => {
    const userToLogin = userMap.get(userId);
    if (userToLogin) {
      setUser(userToLogin);
    } else {
      console.error(`User with id ${userId} not found`);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};