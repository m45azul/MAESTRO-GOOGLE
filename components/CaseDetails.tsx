import React, { useState, useEffect } from 'react';
// FIX: Added User to the import to use it in CaseDetailsProps.
import type { LegalCase, PredictiveAnalysis, TimeLog, User } from '../types';
import { Card } from './Card';
import { MoreVerticalIcon, EditIcon, TrashIcon, SparklesIcon, BrainCircuitIcon } from './icons';
import { userMap } from '../data/users';
import { clientMap } from '../data/clients';
import { tagMap } from '../data/tags';
import { TagBadge } from './TagBadge';
import { getAICaseSummary, getAIPredictiveAnalysis } from '../services/geminiService';
import { CaseUpdatesTab } from './CaseUpdatesTab';
import { TimesheetTab } from './TimesheetTab';
import { useAuth } from '../context/AuthContext';


interface CaseDetailsProps {
  caseData?: LegalCase;
  onAddUpdate: (caseId: string, description: string) => void;
  onEdit: (caseData: LegalCase) => void;
  onArchive: (caseId: string) => void;
  // FIX: Changed the type of onAddTimeLog to match the data passed from the child component. The parent component will handle adding the 'status'.
  onAddTimeLog: (caseId: string, timeLog: Omit<TimeLog, 'id' | 'status'>) => void;
  // FIX: Added missing props to fix type errors in parent component (LegalPage.tsx).
  onUpdateTimeLogStatus: (caseId: string, timeLogId: string, status: TimeLog['status']) => void;
  onReassign: (caseId: string, newResponsibleId: string, reason: string) => void;
  allUsers: User[];
}

const getStatusClasses = (status: LegalCase['status']) => {
    switch(status) {
        case 'Ativo': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Suspenso': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Arquivado': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
}

const PredictiveAnalysisCard: React.FC<{ analysis: PredictiveAnalysis }> = ({ analysis }) => (
    <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-400">{analysis.probabilidadeExito}%</p>
            <p className="text-xs text-slate-400">Probabilidade de Êxito</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-400">{analysis.tempoEstimado} meses</p>
            <p className="text-xs text-slate-400">Tempo Estimado</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-400">R$ {analysis.valorCondenacao.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-400">Condenação Estimada</p>
        </div>
    </div>
);

type ActiveTab = 'andamentos' | 'timesheet';

// FIX: Added missing props to the component signature.
export const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, onAddUpdate, onEdit, onArchive, onAddTimeLog, onUpdateTimeLogStatus, onReassign, allUsers }) => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [predictiveAnalysis, setPredictiveAnalysis] = useState<PredictiveAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState('');
    const [activeTab, setActiveTab] = useState<ActiveTab>('andamentos');

    useEffect(() => {
        setSummary('');
        setPredictiveAnalysis(null);
        setAnalysisError('');
        setActiveTab('andamentos');
    }, [caseData?.id]);

    const handleSummarize = async () => {
        if (!caseData || caseData.updates.length === 0) return;

        setIsSummarizing(true);
        setSummary('');
        const updatesText = caseData.updates
            .map(u => `Em ${new Date(u.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}, ${u.author} registrou: "${u.description}"`)
            .join('\n');
        
        try {
            const result = await getAICaseSummary(updatesText);
            setSummary(result);
        } catch (error) {
            console.error("Failed to get summary:", error);
            setSummary("Não foi possível gerar o resumo. Tente novamente.");
        } finally {
            setIsSummarizing(false);
        }
    };

    const handlePredictiveAnalysis = async () => {
        if (!caseData) return;
        setIsAnalyzing(true);
        setPredictiveAnalysis(null);
        setAnalysisError('');
        
        const caseInfo = `
            Título: ${caseData.title}
            Valor da Causa: R$ ${caseData.valorCausa}
            Tags (Área): ${caseData.tags.map(t => tagMap.get(t)?.name).join(', ')}
            Últimos andamentos: ${caseData.updates.slice(-3).map(u => u.description).join('; ')}
        `;

        try {
            const result = await getAIPredictiveAnalysis(caseInfo);
            setPredictiveAnalysis(JSON.parse(result));
        } catch (error) {
            console.error("Failed to get predictive analysis:", error);
            setAnalysisError("Não foi possível gerar a análise preditiva. Tente novamente.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!caseData || !user) {
        return <Card className="h-full flex items-center justify-center text-slate-500">Selecione um processo para ver os detalhes</Card>;
    }
    
    const responsibleUser = userMap.get(caseData.responsibleId);
    const client = clientMap.get(caseData.clientId);
    const caseTags = caseData.tags.map(tagId => tagMap.get(tagId)).filter(Boolean);

    return (
        <Card className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-700/50 pb-4 mb-4">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-white pr-8">{caseData.title}</h2>
                    <div className="flex items-center space-x-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getStatusClasses(caseData.status)}`}>
                            {caseData.status}
                        </span>
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-white">
                                <MoreVerticalIcon className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-10 w-40">
                                    <button onClick={() => { onEdit(caseData); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"><EditIcon className="w-4 h-4 mr-2" /> Editar Processo</button>
                                    <button onClick={() => { onArchive(caseData.id); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700"><TrashIcon className="w-4 h-4 mr-2" /> Arquivar</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-sm text-slate-400 mt-1">{caseData.processNumber}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-400 mt-3">
                    <span><span className="font-semibold text-slate-300">Cliente:</span> {client?.name || 'Não informado'}</span>
                    <span><span className="font-semibold text-slate-300">Responsável:</span> {responsibleUser?.name || 'Não atribuído'}</span>
                    <span><span className="font-semibold text-slate-300">Parte Contrária:</span> {caseData.opposingParty}</span>
                    <span><span className="font-semibold text-slate-300">Tribunal:</span> {caseData.court}</span>
                    <span><span className="font-semibold text-slate-300">Valor da Causa:</span> R$ {caseData.valorCausa.toLocaleString('pt-BR')}</span>
                </div>
                 <div className="mt-3 flex flex-wrap gap-1">
                    {caseTags.map(tag => tag && <TagBadge key={tag.id} tag={tag} />)}
                </div>
            </div>
            
             <div className="flex justify-between items-center mb-3">
                <div className="flex border-b border-slate-700">
                    <button onClick={() => setActiveTab('andamentos')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'andamentos' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-400'}`}>Andamentos</button>
                    <button onClick={() => setActiveTab('timesheet')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'timesheet' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-400'}`}>Timesheet</button>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={handleSummarize} disabled={isSummarizing || caseData.updates.length === 0} className="flex items-center text-xs px-2 py-1 bg-indigo-600/50 text-indigo-300 rounded-md hover:bg-indigo-600/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <SparklesIcon className="w-4 h-4 mr-1.5" />
                        {isSummarizing ? 'Resumindo...' : 'Resumir'}
                    </button>
                    <button onClick={handlePredictiveAnalysis} disabled={isAnalyzing} className="flex items-center text-xs px-2 py-1 bg-purple-600/50 text-purple-300 rounded-md hover:bg-purple-600/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <BrainCircuitIcon className="w-4 h-4 mr-1.5" />
                        {isAnalyzing ? 'Analisando...' : 'Análise Preditiva'}
                    </button>
                </div>
            </div>

            {(isSummarizing || isAnalyzing) && ( <div className="flex justify-center items-center p-4 my-4 bg-slate-800/50 rounded-lg"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div></div> )}
            {summary && !isSummarizing && (<div className="p-4 my-4 bg-indigo-900/30 rounded-lg border border-indigo-500/50 text-sm text-slate-300"><h4 className="font-bold text-indigo-300 mb-2 flex items-center"><SparklesIcon className="w-4 h-4 mr-2" /> Resumo da IA</h4><p className="whitespace-pre-wrap">{summary}</p></div>)}
            {predictiveAnalysis && !isAnalyzing && (<div className="p-4 my-4 bg-purple-900/30 rounded-lg border border-purple-500/50"><h4 className="font-bold text-purple-300 mb-3 flex items-center"><BrainCircuitIcon className="w-4 h-4 mr-2" /> Análise Preditiva da IA</h4><PredictiveAnalysisCard analysis={predictiveAnalysis} /></div>)}
            {analysisError && !isAnalyzing && ( <div className="p-4 my-4 bg-red-900/30 rounded-lg border border-red-500/50 text-sm text-red-300"><p>{analysisError}</p></div> )}

            {activeTab === 'andamentos' && <CaseUpdatesTab caseData={caseData} onAddUpdate={onAddUpdate} />}
            {/* FIX: Passed the onUpdateTimeLogStatus prop down to the TimesheetTab component. */}
            {activeTab === 'timesheet' && <TimesheetTab caseData={caseData} onAddTimeLog={onAddTimeLog} onUpdateTimeLogStatus={onUpdateTimeLogStatus} currentUser={user} />}
            
        </Card>
    );
};