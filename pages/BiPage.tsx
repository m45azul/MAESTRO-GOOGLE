
import React from 'react';
import { Card } from '../components/Card.tsx';
import { KpiCard } from '../components/KpiCard.tsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { LegalCase, Transaction, Client, Tag } from '../types.ts';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

const COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6'];

export const BiPage: React.FC = () => {
    const { data, isLoading } = useApi();
    const { cases = [], transactions = [], clients = [], tags = [] } = data || {};

    const totalRevenue = transactions
        .filter(t => t.type === 'Receita' && t.status === 'Realizado')
        .reduce((sum, t) => sum + t.value, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'Despesa' && t.status === 'Realizado')
        .reduce((sum, t) => sum + t.value, 0);
        
    const activeCasesCount = cases.filter(c => c.status === 'Ativo' && !c.isDeleted).length;
    const totalClients = clients.filter(c => !c.isDeleted).length;
    
    const casesByTag = React.useMemo(() => {
        const tagMap = new Map<string, string>(tags.map(t => [t.id, t.name]));
        const areaTags = tags.filter(t => t.category === 'area_atuacao').map(t => t.id);
        const counts: { [key: string]: number } = {};
        
        cases.forEach(c => {
            c.tags.forEach(tagId => {
                if (areaTags.includes(tagId)) {
                    const tagName = tagMap.get(tagId) || 'Outros';
                    counts[tagName] = (counts[tagName] || 0) + 1;
                }
            });
        });

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [cases, tags]);
    
    const monthlyFinancials = React.useMemo(() => {
        const months: { [key: string]: { revenue: number, expense: number } } = {};
        transactions.forEach(t => {
            if (t.status === 'Realizado') {
                const monthYear = new Date(t.date).toISOString().substring(0, 7); // YYYY-MM
                if (!months[monthYear]) {
                    months[monthYear] = { revenue: 0, expense: 0 };
                }
                if (t.type === 'Receita') {
                    months[monthYear].revenue += t.value;
                } else {
                    months[monthYear].expense += t.value;
                }
            }
        });
        
        return Object.entries(months)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([monthYear, values]) => {
                const date = new Date(monthYear + '-02'); // Use day 2 to avoid timezone issues
                return { 
                    name: date.toLocaleString('default', { month: 'short', year: '2-digit' }), 
                    Receita: values.revenue, 
                    Despesa: values.expense 
                };
            });

    }, [transactions]);

    if (isLoading) {
         return (
            <div className="space-y-6 md:space-y-8">
                <SkeletonLoader className="h-10 w-1/3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-28" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonLoader className="h-96" />
                    <SkeletonLoader className="h-96" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <h1 className="text-2xl font-bold text-white">Business Intelligence & Relatórios</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Receita Total (Realizada)" value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Despesa Total (Realizada)" value={`R$ ${totalExpense.toLocaleString('pt-BR')}`} change="" isNegative />
                <KpiCard title="Total de Clientes Ativos" value={totalClients.toString()} change="" />
                <KpiCard title="Total de Processos Ativos" value={activeCasesCount.toString()} change="" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-4">Receitas vs. Despesas (Mensal)</h3>
                     <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={monthlyFinancials}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `R$${Number(value)/1000}k`}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend wrapperStyle={{fontSize: '12px'}}/>
                            <Bar dataKey="Receita" fill="#10b981" />
                            <Bar dataKey="Despesa" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                 <Card className="h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Processos por Área</h3>
                     <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie data={casesByTag} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                {casesByTag.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};
