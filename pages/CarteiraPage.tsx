
import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Carteira, LegalCase, CarteiraProcesso } from '../types.ts';
import { Card } from '../components/Card.tsx';
import { KpiCard } from '../components/KpiCard.tsx';
import { WalletIcon } from '../components/icons.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

export const CarteiraPage: React.FC = () => {
    const { user } = useAuth();
    const { data, isLoading } = useApi();
    const { cases = [] } = data || {};

    const carteiraData: Carteira = useMemo(() => {
        if (!user) {
            return {
                salarioFixo: 0,
                ajudaCusto: 0,
                totalFixo: 0,
                processos: [],
                totalVariavel: 0,
                totalGeral: 0,
            };
        }

        const myCases = cases.filter(c => c.responsibleId === user.id && c.status === 'Ativo' && !c.isDeleted);

        const processos: CarteiraProcesso[] = myCases.map(c => {
            const valorCarteira = c.honorariosPrevistos * (c.percentualAdvogado / 100);
            return {
                id: c.id,
                title: c.title,
                honorariosPrevistos: c.honorariosPrevistos,
                percentualAdvogado: c.percentualAdvogado,
                valorCarteira: valorCarteira,
            };
        });

        const totalVariavel = processos.reduce((sum, p) => sum + p.valorCarteira, 0);
        
        const salarioFixo = user.valorHora ? user.valorHora * 160 : 5000;
        const ajudaCusto = 1000;
        const totalFixo = salarioFixo + ajudaCusto;

        return {
            salarioFixo,
            ajudaCusto,
            totalFixo,
            processos,
            totalVariavel,
            totalGeral: totalFixo + totalVariavel,
        };
    }, [user, cases]);

    if (isLoading || !user) {
        return (
            <div className="space-y-6 md:space-y-8">
                 <SkeletonLoader className="h-10 w-1/2" />
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-28" />)}
                </div>
                <SkeletonLoader className="h-96" />
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex items-center space-x-3">
                <WalletIcon className="w-8 h-8 text-indigo-400" />
                <h1 className="text-2xl font-bold text-white">Minha Carteira de Honorários</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Fixo Mensal" value={`R$ ${carteiraData.totalFixo.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Variável (Potencial)" value={`R$ ${carteiraData.totalVariavel.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Total Geral (Potencial)" value={`R$ ${carteiraData.totalGeral.toLocaleString('pt-BR')}`} change="" />
                <KpiCard title="Processos na Carteira" value={`${carteiraData.processos.length}`} change="" />
            </div>

            <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Detalhamento dos Processos</h2>
                <div className="overflow-x-auto">
                    {carteiraData.processos.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Processo</th>
                                    <th scope="col" className="px-6 py-3 text-right">Honorários Previstos</th>
                                    <th scope="col" className="px-6 py-3 text-right">% da Carteira</th>
                                    <th scope="col" className="px-6 py-3 text-right">Valor na Carteira</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carteiraData.processos.map(p => (
                                    <tr key={p.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-slate-200">{p.title}</td>
                                        <td className="px-6 py-4 text-right">R$ {p.honorariosPrevistos.toLocaleString('pt-BR')}</td>
                                        <td className="px-6 py-4 text-right">{p.percentualAdvogado}%</td>
                                        <td className="px-6 py-4 text-right font-semibold text-indigo-300">R$ {p.valorCarteira.toLocaleString('pt-BR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-slate-500 py-8">Você não possui processos em sua carteira no momento.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};
