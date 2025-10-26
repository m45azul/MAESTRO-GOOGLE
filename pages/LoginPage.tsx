import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MaestroLogo } from '../components/icons';
import { mockUsers } from '../data/users';
import type { User } from '../types';

const UserLoginCard: React.FC<{ user: User, onLogin: (id: string) => void }> = ({ user, onLogin }) => (
    <button onClick={() => onLogin(user.id)} className="flex items-center w-full p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left">
        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
        <div className="ml-4">
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-sm text-slate-400">{user.role}</p>
        </div>
    </button>
);


export const LoginPage: React.FC = () => {
    const { login } = useAuth();

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-lg border border-slate-700/50">
                <div className="text-center">
                    <div className="flex justify-center mb-4 text-indigo-400">
                        <MaestroLogo />
                    </div>
                    <h1 className="text-2xl font-bold text-white">MAESTRO</h1>
                    <p className="mt-2 text-sm text-slate-400">Selecione um perfil para entrar</p>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {mockUsers.map(user => (
                        <UserLoginCard key={user.id} user={user} onLogin={login} />
                    ))}
                </div>
            </div>
        </div>
    );
};