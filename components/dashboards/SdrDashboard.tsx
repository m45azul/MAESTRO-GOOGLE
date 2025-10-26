
import React from 'react';
import { Card } from '../Card';
import { KpiCard } from '../KpiCard';
import { TaskList } from '../TaskList';
import { mockLeads } from '../../data/leads';
import type { User, Task } from '../../types';

interface SdrDashboardProps {
    user: User;
    tasks: Task[];
}

export const SdrDashboard: React.FC<SdrDashboardProps> = ({ user, tasks }) => {
    const myLeads = mockLeads.filter(l => l.responsibleId === user.id && !l.isDeleted);
    
    const leadsInNegotiation = myLeads.filter(l => l.stage === 'Proposta' || l.stage === 'Negociação');
    const negotiationValue = leadsInNegotiation.reduce((sum, lead) => sum + lead.value, 0);
    const newLeadsCount = myLeads.filter(l => l.stage === 'Novo').length;
    const convertedThisMonth = myLeads.filter(l => l.stage === 'Ganho').length; // Simplified for MVP

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Meus Leads Ativos" value={myLeads.length.toString()} change="" />
                <KpiCard title="Novos Leads" value={newLeadsCount.toString()} change="" />
                <KpiCard title="Valor em Negociação" value={`R$ ${negotiationValue.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Convertidos (Mês)" value={convertedThisMonth.toString()} change="" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">Meu Funil de Vendas</h3>
                    <div className="space-y-3">
                        {['Novo', 'Contatado', 'Qualificado', 'Proposta', 'Negociação'].map(stage => {
                            const count = myLeads.filter(l => l.stage === stage).length;
                            return (
                                <div key={stage} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300">{stage}</span>
                                    <span className="font-bold text-white bg-slate-700 px-2 py-1 rounded">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </Card>
                <TaskList tasks={tasks} />
            </div>
        </div>
    );
};
