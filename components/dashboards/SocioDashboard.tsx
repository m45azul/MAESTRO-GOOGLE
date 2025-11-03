
import React from 'react';
import { Card } from '../Card';
import { User } from '../../types.ts';

interface SocioDashboardProps {
    user: User;
}

export const SocioDashboard: React.FC<SocioDashboardProps> = ({ user }) => {
    return (
        <Card>
            <h1 className="text-2xl font-bold text-white">Dashboard do Sócio</h1>
            <p className="mt-4 text-slate-400">
                Bem-vindo, {user.name}. Aqui você visualizará seu mini-painel financeiro com o resultado consolidado,
                projeções e poderá solicitar retiradas ou aportes.
            </p>
        </Card>
    );
};