import React from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();

  if (!user) {
    return null; // Should not happen in a protected route, but good practice
  }

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-slate-800/50 border-b border-slate-700/50 flex-shrink-0">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-xs text-slate-400">{user.role}</p>
        </div>
        <img
          className="w-10 h-10 rounded-full"
          src={user.avatarUrl}
          alt={user.name}
        />
      </div>
    </header>
  );
};