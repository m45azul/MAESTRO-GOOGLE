import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockCases } from '../data/cases';
import type { Carteira } from '../types';
import { Card } from '../components/Card';
import { KpiCard } from '../components/KpiCard';

export const CarteiraPage: React.FC = () => {
    const { user } = useAuth();

    const carteiraData = useMemo((): Carteira | null => {
        if (!user) return null;
        
        // Mock data, in a real app this would be an API call
        const salarioFixo = 8000;
        const ajudaCusto = 1500;
        
        const processos = mockCases
            .filter(c => c.responsibleId === user.id)
            .map(c => ({
                id: c.id,
                title: c.title,
                honorariosPrevistos: c.honorariosPrevistos,
                percentualAdvogado: c.percentualAdvogado,
                valorCarteira: c.honorariosPrevistos * (c.percentualAdvogado / 100)
            }));
            
        const totalVariavel = processos.reduce((sum, p) => sum + p.valorCarteira, 0);
        const totalFixo = salarioFixo + ajudaCusto;
        const totalGeral = totalFixo + totalVariavel;

        return {
            salarioFixo,
            ajudaCusto,
            totalFixo,
            processos,
            totalVariavel,
            totalGeral,
        };
    }, [user]);

    if (!user || !carteiraData) {
        return <Card>Carregando dados da carteira...</Card>;
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <h2 className="text-2xl font-bold text-white">Minha Carteira - Visão Geral</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Salário Fixo" value={`R$ ${carteiraData.salarioFixo.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Ajuda de Custo" value={`R$ ${carteiraData.ajudaCusto.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Total Variável (Previsto)" value={`R$ ${carteiraData.totalVariavel.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Valor Total da Carteira" value={`R$ ${carteiraData.totalGeral.toLocaleString('pt-BR')}`} change="" />
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Composição da Remuneração Variável</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Processo</th>
                                <th scope="col" className="px-6 py-3 text-right">Honorários (Total)</th>
                                <th scope="col" className="px-6 py-3 text-center">% na Carteira</th>
                                <th scope="col" className="px-6 py-3 text-right">Valor na Carteira</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carteiraData.processos.map(p => (
                                <tr key={p.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-slate-200">{p.title}</td>
                                    <td className="px-6 py-4 text-right">R$ {p.honorariosPrevistos.toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4 text-center">{p.percentualAdvogado}%</td>
                                    <td className="px-6 py-4 font-semibold text-right text-indigo-300">R$ {p.valorCarteira.toLocaleString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-white bg-slate-800">
                                <td colSpan={3} className="px-6 py-3 text-right">Total Variável (Previsto)</td>
                                <td className="px-6 py-3 text-right text-lg">R$ {carteiraData.totalVariavel.toLocaleString('pt-BR')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>
        </div>
    );
};
