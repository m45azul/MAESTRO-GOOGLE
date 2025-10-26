
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800 rounded-xl p-4 md:p-6 shadow-lg border border-slate-700/50 ${className}`}>
      {children}
    </div>
  );
};
