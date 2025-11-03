

import React, { useMemo } from 'react';
import { NetMarginChart } from '../NetMarginChart';
import { KpiCard } from '../KpiCard';
import { Card } from '../Card';
import { User } from '../../types.ts';

const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 80) return 'text-amber-400';
    return 'text-red-400';
};

const TeamPerformance: React.FC<{users: User[]}> = ({ users }) => {
    const teamData = useMemo(() => users
      .filter(u => u.role === 'Advogado Interno')
      .map(u => ({
          ...u,
          casesCompleted: Math.floor(Math.random() * 25) + 5,
          successRate: Math.floor(Math.random() * 20) + 80,
      }))
      .sort((a,b) => b.casesCompleted - a.casesCompleted), [users]);

    return (
        <Card className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Performance da Equipe (Mês)</h3>
            <div className="space-y-4 pr-2 overflow-y-auto max-h-[400px]">
                {teamData.map((lawyer) => (
                    <div key={lawyer.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center">
                            <img src={lawyer.avatarUrl} alt={lawyer.name} className="w-10 h-10 rounded-full" />
                            <div className="ml-4">
                                <p className="font-medium text-slate-200">{lawyer.name}</p>
                                <p className="text-xs text-slate-400">Casos Concluídos: {lawyer.casesCompleted}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold text-lg ${getSuccessRateColor(lawyer.successRate)}`}>
                                {lawyer.successRate}%
                            </p>
                            <p className="text-xs text-slate-400">Sucesso</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

interface ControllerDashboardProps {
    users: User[];
}

export const ControllerDashboard: React.FC<ControllerDashboardProps> = ({ users }) => {
    return (
        <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="Margem Líquida (Mês)" value={`R$ 42.550`} change="+5.2%" />
                <KpiCard title="Processos Ativos (Total)" value="152" change="+12" />
                <KpiCard title="Taxa de Sucesso (Geral)" value="91%" change="+1.5%" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <NetMarginChart />
                </div>
                <TeamPerformance users={users} />
            </div>
        </div>
    );
};