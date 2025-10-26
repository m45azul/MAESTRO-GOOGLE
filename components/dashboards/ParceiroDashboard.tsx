import React from 'react';
import { Card } from '../Card';
import type { User } from '../../types';

interface ParceiroDashboardProps {
    user: User;
}

export const ParceiroDashboard: React.FC<ParceiroDashboardProps> = ({ user }) => {
    return (
        <Card>
            <h1 className="text-2xl font-bold text-white">Portal do Parceiro</h1>
            <p className="mt-4 text-slate-400">
                Bem-vindo, {user.name} ({user.role}). Aqui você pode registrar e acompanhar suas indicações,
                gerenciar seu pipeline de leads (se aplicável) e visualizar sua carteira de comissões.
            </p>
        </Card>
    );
};