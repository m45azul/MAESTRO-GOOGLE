import React from 'react';
import { Card } from '../Card';
import type { User } from '../../types';

interface AdvogadoParceiroDashboardProps {
    user: User;
}

export const AdvogadoParceiroDashboard: React.FC<AdvogadoParceiroDashboardProps> = ({ user }) => {
    return (
        <Card>
            <h1 className="text-2xl font-bold text-white">Dashboard do Advogado Parceiro</h1>
            <p className="mt-4 text-slate-400">
                Bem-vindo, {user.name}. Nesta área, você tem acesso aos processos que foram especificamente atribuídos a você,
                pode registrar andamentos e visualizar sua carteira de honorários.
            </p>
        </Card>
    );
};