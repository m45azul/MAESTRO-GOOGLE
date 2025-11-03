import React from 'react';
import { Card } from '../components/Card.tsx';
import { LegalCase, CaseUpdate, Client } from '../types.ts';
import { FileTextIcon } from '../components/icons.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

// Mock client ID for simulation
const MOCK_CLIENT_ID = 'client-1';

const simplifyDescription = (update: CaseUpdate): string => {
    const desc = update.description.toLowerCase();
    if (desc.includes('petição inicial') || desc.includes('distribuído')) {
        return 'Iniciamos o seu processo e o protocolamos na justiça.';
    }
    if (desc.includes('audiência')) {
        return `Uma audiência foi agendada. A data é: ${desc.split('para ')[1] || 'a ser confirmada'}.`;
    }
    if (desc.includes('sentença')) {
        return 'O juiz deu uma decisão sobre o caso. Entraremos em contato com os detalhes.';
    }
     if (desc.includes('contesta')) {
        return 'A outra parte apresentou sua defesa no processo.';
    }
    if (desc.includes('publicação')) {
        return 'Houve uma nova movimentação no seu processo. Estamos analisando.';
    }
    return 'Realizamos uma nova movimentação para dar andamento ao seu caso.';
};

const ClientCaseTimeline: React.FC<{ caseData: LegalCase }> = ({ caseData }) => {
    return (
        <Card className="mb-6">
            <div className="border-b border-slate-700/50 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white">{caseData.title}</h3>
                <p className="text-sm text-slate-400 mt-1">Nº do Processo: {caseData.processNumber}</p>
            </div>
            <div className="relative border-l-2 border-slate-700 ml-2">
                {caseData.updates.slice().reverse().map((update) => (
                    <div key={update.id} className="mb-6 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full -left-3 ring-4 ring-slate-800">
                            <FileTextIcon className="w-3 h-3 text-indigo-400"/>
                        </span>
                        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <p className="text-sm font-medium text-slate-200">{simplifyDescription(update)}</p>
                            <p className="text-xs text-slate-500 mt-2">
                                Em {new Date(update.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const ClientPortalPage: React.FC = () => {
    const { data, isLoading } = useApi();

    if (isLoading) {
        return (
            <div className="space-y-6 md:space-y-8">
                <SkeletonLoader className="h-28" />
                <SkeletonLoader className="h-80" />
            </div>
        );
    }

    const { cases = [], clients = [] } = data || {};

    const client = clients.find(c => c.id === MOCK_CLIENT_ID);
    const clientCases = cases.filter(c => c.clientId === MOCK_CLIENT_ID && !c.isDeleted);

    if (!client) {
        return <Card><p className="text-center text-slate-500 py-8">Cliente de simulação não encontrado.</p></Card>;
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                <h1 className="text-2xl font-bold text-white">Bem-vinda, {client.name}!</h1>
                <p className="text-slate-400 mt-1">Este é o seu portal para acompanhar seus processos de forma simples e transparente.</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Seus Processos</h2>
                {clientCases.length > 0 ? (
                    clientCases.map(caseData => <ClientCaseTimeline key={caseData.id} caseData={caseData} />)
                ) : (
                    <Card>
                        <p className="text-slate-500 text-center">Você não possui processos ativos no momento.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};