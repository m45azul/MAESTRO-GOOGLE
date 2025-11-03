import React, { useState, useEffect, useRef } from 'react';
import { LegalCase, PredictiveAnalysis, TimeLog, User, Client, Document } from '../types.ts';
import { Card } from './Card.tsx';
import { MoreVerticalIcon, EditIcon, TrashIcon, SparklesIcon, BrainCircuitIcon, RefreshCwIcon, UploadCloudIcon } from './icons.tsx';
import { userMap, tagMap } from '../data/allData.ts';
import { TagBadge } from './TagBadge.tsx';
import { getAICaseSummary, getAIPredictiveAnalysis } from '../services/geminiService.ts';
import { CaseUpdatesTab } from './CaseUpdatesTab.tsx';
import { TimesheetTab } from './TimesheetTab.tsx';
import { useAuth } from '../context/AuthContext.tsx';


interface CaseDetailsProps {
  caseData?: LegalCase;
  onAddUpdate: (caseId: string, authorId: string, description: string) => Promise<void>;
  onEdit: (caseData: LegalCase) => void;
  onArchive: (caseId: string) => Promise<void>;
  onAddTimeLog: (caseId: string, timeLog: Omit<TimeLog, 'id' | 'status'>) => Promise<void>;
  onUpdateTimeLogStatus: (caseId: string, timeLogId: string, status: TimeLog['status']) => Promise<void>;
  onReassign: (caseId: string, newResponsibleId: string, reason: string) => void;
  allUsers: User[];
  clientMap: Map<string, Client>;
  onSyncCaseWithCourt: (caseId: string) => Promise<void>;
  onUploadDocument: (caseId: string, file: File) => Promise<void>;
  onAnalyzeDocument: (caseId: string, documentId: string) => Promise<void>;
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

const DocumentsTab: React.FC<{
    caseData: LegalCase;
    onUploadDocument: (caseId: string, file: File) => Promise<void>;
    onAnalyzeDocument: (caseId: string, documentId: string) => Promise<void>;
}> = ({ caseData, onUploadDocument, onAnalyzeDocument }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                await onUploadDocument(caseData.id, file);
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Falha no upload do documento.");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleAnalyze = async (documentId: string) => {
        setAnalyzingId(documentId);
        try {
            await onAnalyzeDocument(caseData.id, documentId);
        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Falha na análise do documento.");
        } finally {
            setAnalyzingId(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 mb-4">
                {caseData.documents?.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">Nenhum documento anexado a este processo.</div>
                ) : (
                    <div className="space-y-3">
                        {caseData.documents?.map(doc => (
                            <div key={doc.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-slate-200">{doc.name}</p>
                                        <p className="text-xs text-slate-400">Upload em: {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAnalyze(doc.id)}
                                        disabled={analyzingId === doc.id || !!doc.extractedText}
                                        className="flex items-center text-xs px-2 py-1 bg-indigo-600/50 text-indigo-300 rounded-md hover:bg-indigo-600/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <SparklesIcon className={`w-4 h-4 mr-1.5 ${analyzingId === doc.id ? 'animate-spin' : ''}`} />
                                        {analyzingId === doc.id ? 'Analisando...' : doc.extractedText ? 'Analisado' : 'Analisar com IA'}
                                    </button>
                                </div>
                                {doc.extractedText && (
                                     <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-300 whitespace-pre-wrap bg-slate-700/30 p-2 rounded-md">
                                        <p className="font-bold text-indigo-300 mb-1">Resumo da IA:</p>
                                        {doc.extractedText}
                                     </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
             <div className="mt-auto pt-4 border-t border-slate-700/50">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                    <UploadCloudIcon className="w-5 h-5 mr-2"/>
                    {uploading ? 'Enviando...' : 'Fazer Upload de Documento'}
                </button>
            </div>
        </div>
    );
};

type ActiveTab = 'andamentos' | 'timesheet' | 'documentos';

export const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, onAddUpdate, onEdit, onArchive, onAddTimeLog, onUpdateTimeLogStatus, onReassign, allUsers, clientMap, onSyncCaseWithCourt, onUploadDocument, onAnalyzeDocument }) => {
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
            <div className="flex-shrink-0 border-b border-slate-700/50 pb-4 mb-4">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-white pr-8">{caseData.title}</h2>
                    <div className="flex items-center space-x-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getStatusClasses(caseData.status)}`}>
                            {caseData.status}
                        </span>
                         <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)} className="text-slate-400 hover:text-white p-1">
                                <MoreVerticalIcon className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10 w-40">
                                    <button onClick={() => { onEdit(caseData); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-t-md"><EditIcon className="w-4 h-4 mr-2" /> Editar Processo</button>
                                    <button onClick={async () => { await onArchive(caseData.id); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-slate-700 rounded-b-md"><TrashIcon className="w-4 h-4 mr-2" /> Arquivar</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-slate-400 mt-3">
                    <div><span className="font-semibold text-slate-300">Cliente:</span> {client?.name || 'N/A'}</div>
                    <div><span className="font-semibold text-slate-300">Parte Contrária:</span> {caseData.opposingParty}</div>
                    <div><span className="font-semibold text-slate-300">Nº Processo:</span> {caseData.processNumber}</div>
                    <div><span className="font-semibold text-slate-300">Responsável:</span> {responsibleUser?.name || 'N/A'}</div>
                </div>
                 {caseTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {caseTags.map(tag => tag && <TagBadge key={tag.id} tag={tag} />)}
                    </div>
                )}
            </div>

            {/* AI Features & Tabs */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex space-x-2 border-b border-slate-700/50 mb-4">
                    {['andamentos', 'timesheet', 'documentos'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as ActiveTab)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${
                                activeTab === tab
                                ? 'bg-slate-800 text-white'
                                : 'bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                    <div className="flex-1 flex justify-end items-center space-x-4">
                       <button onClick={handleSummarize} disabled={isSummarizing} className="flex items-center text-xs px-2 py-1 bg-indigo-600/50 text-indigo-300 rounded-md hover:bg-indigo-600/80 transition-colors disabled:opacity-50">
                            <SparklesIcon className={`w-4 h-4 mr-1.5 ${isSummarizing ? 'animate-spin' : ''}`} />
                            {isSummarizing ? 'Resumindo...' : 'Resumir com IA'}
                        </button>
                        <button onClick={async () => await onSyncCaseWithCourt(caseData.id)} className="flex items-center text-xs px-2 py-1 bg-slate-600/50 text-slate-300 rounded-md hover:bg-slate-600/80 transition-colors">
                            <RefreshCwIcon className="w-4 h-4 mr-1.5" />
                            Sincronizar
                        </button>
                    </div>
                </div>
                
                {summary && (
                    <div className="mb-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg text-sm text-indigo-200">
                        <p className="font-bold mb-1">Resumo da IA:</p>
                        <p>{summary}</p>
                    </div>
                )}
                
                {/* Tab Content */}
                <div className="flex-1 min-h-0">
                    {activeTab === 'andamentos' && <CaseUpdatesTab caseData={caseData} onAddUpdate={onAddUpdate} currentUser={user} />}
                    {activeTab === 'timesheet' && <TimesheetTab caseData={caseData} onAddTimeLog={onAddTimeLog} onUpdateTimeLogStatus={onUpdateTimeLogStatus} currentUser={user} />}
                    {activeTab === 'documentos' && <DocumentsTab caseData={caseData} onUploadDocument={onUploadDocument} onAnalyzeDocument={onAnalyzeDocument} />}
                </div>
            </div>
        </Card>
    );
};