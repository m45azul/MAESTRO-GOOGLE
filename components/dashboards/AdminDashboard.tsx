import React from 'react';
import { Card } from '../Card';
import type { User } from '../../types';

interface AdminDashboardProps {
    user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    return (
        <Card>
            <h1 className="text-2xl font-bold text-white">Dashboard Administrativo/Financeiro</h1>
            <p className="mt-4 text-slate-400">
                Bem-vindo, {user.name}. Sua área de trabalho para gestão de transações financeiras, conciliação bancária,
                gestão de fornecedores e cobranças.
            </p>
        </Card>
    );
};