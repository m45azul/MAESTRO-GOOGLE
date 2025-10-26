
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    // In a real app, you'd fetch user data from an API after validating credentials
    // For this MVP, we'll use a mock user based on the MAESTRO profile
    const mockUser: User = {
        // FIX: Added missing 'id' property to satisfy the User type.
        id: 'user-5', // Corresponds to 'Sócio Fundador' in mockUsers
        name: 'Sócio Fundador',
        role: 'MAESTRO',
        email: email,
        avatarUrl: `https://i.pravatar.cc/150?u=maestro`
    };
    setUser(mockUser);
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
