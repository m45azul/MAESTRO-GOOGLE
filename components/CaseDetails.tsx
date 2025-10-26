
import React, { useState, useEffect } from 'react';
import type { LegalCase } from '../types';
import { Card } from './Card';
import { FileTextIcon, MoreVerticalIcon, EditIcon, TrashIcon, SparklesIcon } from './icons';
import { userMap } from '../data/users';
import { clientMap } from '../data/clients';
import { tagMap } from '../data/tags';
import { TagBadge } from './TagBadge';
import { getAICaseSummary } from '../services/geminiService';

interface CaseDetailsProps {
  caseData?: LegalCase;
  onAddUpdate: (caseId: string, description: string) => void;
  onEdit: (caseData: LegalCase) => void;
  onArchive: (caseId: string) => void;
}

const getStatusClasses = (status: LegalCase['status']) => {
    switch(status) {
        case 'Ativo': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Suspenso': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Arquivado': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
}

export const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, onAddUpdate, onEdit, onArchive }) => {
    const [newUpdate, setNewUpdate] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        setSummary('');
    }, [caseData?.id]);

    const handleSummarize = async () => {
        if (!caseData || caseData.updates.length === 0) return;

        setIsSummarizing(true);
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

    if (!caseData) {
        return <Card className="h-full flex items-center justify-center text-slate-500">Selecione um processo para ver os detalhes</Card>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUpdate.trim()) {
            onAddUpdate(caseData.id, newUpdate);
            setNewUpdate('');
        }
    }
    
    const responsibleUser = userMap.get(caseData.responsibleId);
    const client = clientMap.get(caseData.clientId);
    const caseTags = caseData.tags.map(tagId => tagMap.get(tagId)).filter(Boolean);

    return (
        <Card className="h-full flex flex-col">
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
                <p className="text-sm text-slate-400 mt-1">{caseData.caseNumber}</p>
                <div className="flex text-xs text-slate-400 mt-3 space-x-4">
                    <span><span className="font-semibold text-slate-300">Cliente:</span> {client?.name || 'Não informado'}</span>
                    <span><span className="font-semibold text-slate-300">Responsável:</span> {responsibleUser?.name || 'Não atribuído'}</span>
                </div>
                 <div className="mt-3 flex flex-wrap gap-1">
                    {caseTags.map(tag => tag && <TagBadge key={tag.id} tag={tag} />)}
                </div>
            </div>
            
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white">Andamentos</h3>
                <button
                    onClick={handleSummarize}
                    disabled={isSummarizing || caseData.updates.length === 0}
                    className="flex items-center text-xs px-2 py-1 bg-indigo-600/50 text-indigo-300 rounded-md hover:bg-indigo-600/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-4 h-4 mr-1.5" />
                    {isSummarizing ? 'Resumindo...' : 'Resumir com IA'}
                </button>
            </div>

            {isSummarizing && (
                <div className="flex justify-center items-center p-4 mb-4 bg-slate-800/50 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>
                </div>
            )}
            {summary && !isSummarizing && (
                <div className="p-4 mb-4 bg-indigo-900/30 rounded-lg border border-indigo-500/50 text-sm text-slate-300">
                    <h4 className="font-bold text-indigo-300 mb-2 flex items-center">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Resumo da IA
                    </h4>
                    <p className="whitespace-pre-wrap">{summary}</p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 mb-4">
                <div className="relative border-l-2 border-slate-700 ml-2">
                    {caseData.updates.slice().reverse().map((update, index) => (
                        <div key={update.id} className="mb-6 ml-6">
                             <span className="absolute flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full -left-3 ring-4 ring-slate-800">
                                <FileTextIcon className="w-3 h-3 text-indigo-400"/>
                            </span>
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <p className="text-sm text-slate-300">{update.description}</p>
                                <p className="text-xs text-slate-500 mt-2">
                                    {new Date(update.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} por {update.author}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-auto pt-4 border-t border-slate-700/50">
                <textarea
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    placeholder="Registrar novo andamento manual..."
                    className="w-full h-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button type="submit" className="w-full mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-50" disabled={!newUpdate.trim()}>
                    Adicionar Andamento
                </button>
            </form>
        </Card>
    );
};
