import React from 'react';
import { KpiCard } from '../KpiCard';
import { LeadsByOriginChart } from '../LeadsByOriginChart';
import { NetMarginChart } from '../NetMarginChart';
import { TaskList } from '../TaskList';
import { GeminiInsightCard } from '../GeminiInsightCard';
import { Card } from '../Card';
import { mockUsers } from '../../data/users';

const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 80) return 'text-amber-400';
    return 'text-red-400';
};

const TeamPerformance: React.FC = () => {
    const teamData = mockUsers
      .filter(u => u.role === 'Advogado Interno')
      .map(u => ({
          ...u,
          casesCompleted: Math.floor(Math.random() * 25) + 5,
          successRate: Math.floor(Math.random() * 20) + 80,
      }))
      .sort((a,b) => b.casesCompleted - a.casesCompleted)
      .slice(0, 4);

    return (
        <Card className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Performance da Equipe (Mês)</h3>
            <div className="space-y-4 pr-2 overflow-y-auto max-h-[300px]">
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

export const MaestroDashboard: React.FC = () => {
  const kpiData = {
    netMargin: 42550.00,
    cac: 1250.00,
    clv: 8500.00,
    newLeads: 85,
  }

  const kpiDataString = `
  - Margem Líquida (Mês): R$ ${kpiData.netMargin.toFixed(2)}
  - Custo de Aquisição de Cliente (CAC): R$ ${kpiData.cac.toFixed(2)}
  - Lifetime Value (CLV): R$ ${kpiData.clv.toFixed(2)}
  - Novos Leads (Mês): ${kpiData.newLeads}
  - Origem dos Leads: Parceiros (40%), Google Ads (30%), Orgânico (20%), Outros (10%)
  - Tarefas Críticas Pendentes: 3
  `;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Margem Líquida (Mês)" value={`R$ ${kpiData.netMargin.toLocaleString('pt-BR')}`} change="+5.2%" />
        <KpiCard title="Custo de Aquisição (CAC)" value={`R$ ${kpiData.cac.toLocaleString('pt-BR')}`} change="-1.8%" isNegative />
        <KpiCard title="Lifetime Value (CLV)" value={`R$ ${kpiData.clv.toLocaleString('pt-BR')}`} change="+12%" />
        <KpiCard title="Novos Leads (Mês)" value={kpiData.newLeads.toString()} change="+15%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NetMarginChart />
        </div>
        <LeadsByOriginChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskList />
        <TeamPerformance />
        <GeminiInsightCard kpiData={kpiDataString} />
      </div>
    </div>
  );
};