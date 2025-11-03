
import React from 'react';
import { Card } from '../Card';
import { User } from '../../types.ts';

interface OperadorDashboardProps {
    user: User;
}

export const OperadorDashboard: React.FC<OperadorDashboardProps> = ({ user }) => {
    return (
        <Card>
            <h1 className="text-2xl font-bold text-white">Dashboard de Atendimento</h1>
            <p className="mt-4 text-slate-400">
                Bem-vindo, {user.name}. Este é o seu hub de comunicação para responder, triar e transferir
                todas as conversas de clientes e leads.
            </p>
        </Card>
    );
};