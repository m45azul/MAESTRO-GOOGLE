
import React from 'react';
import { Card } from '../Card';
import { KpiCard } from '../KpiCard';
import { TaskList } from '../TaskList';
import { mockCases } from '../../data/cases';
import { clientMap } from '../../data/clients';
import type { User, Task } from '../../types';

interface AdvogadoDashboardProps {
    user: User;
    tasks: Task[];
}

export const AdvogadoDashboard: React.FC<AdvogadoDashboardProps> = ({ user, tasks }) => {
    const myCases = mockCases.filter(c => c.responsibleId === user.id && c.status === 'Ativo');
    const totalValue = myCases.reduce((sum, c) => sum + c.valorCausa, 0);

    return (
        <div className="space-y-6 md:space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="Meus Processos Ativos" value={myCases.length.toString()} change="" />
                <KpiCard title="Valor Total em Causa" value={`R$ ${totalValue.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Próximos Prazos (7 dias)" value="3" change="" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">Meus Processos Ativos</h3>
                     <div className="space-y-3 pr-2 overflow-y-auto max-h-[400px]">
                        {myCases.map(c => (
                            <div key={c.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <p className="font-medium text-slate-200">{c.title}</p>
                                <p className="text-xs text-slate-400">Cliente: {clientMap.get(c.clientId)?.name || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                <TaskList tasks={tasks} />
            </div>
        </div>
    );
};
