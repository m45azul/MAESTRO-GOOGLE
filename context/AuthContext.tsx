import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types.ts';
import { userMap } from '../data/allData.ts';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userId: string) => {
    // Simulate API call
    await new Promise(res => setTimeout(res, 300));
    const userToLogin = userMap.get(userId);
    if (userToLogin) {
      setUser(userToLogin);
    } else {
      console.error(`User with ID ${userId} not found.`);
      throw new Error("User not found");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
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