import React, { useState } from 'react';
import { LegalCase, User } from '../types.ts';
import { FileTextIcon } from './icons.tsx';

interface CaseUpdatesTabProps {
    caseData: LegalCase;
    onAddUpdate: (caseId: string, authorId: string, description: string) => Promise<void>;
    currentUser: User;
}

export const CaseUpdatesTab: React.FC<CaseUpdatesTabProps> = ({ caseData, onAddUpdate, currentUser }) => {
    const [newUpdate, setNewUpdate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newUpdate.trim()) {
            setIsSubmitting(true);
            try {
                await onAddUpdate(caseData.id, currentUser.id, newUpdate);
                setNewUpdate('');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 mb-4">
                {caseData.updates.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">Nenhum andamento registrado para este processo.</div>
                ) : (
                    <div className="relative border-l-2 border-slate-700 ml-3">
                        {caseData.updates.slice().reverse().map((update) => (
                            <div key={update.id} className="mb-6 ml-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full -left-3 ring-4 ring-slate-800">
                                    <FileTextIcon className="w-3 h-3 text-indigo-400"/>
                                </span>
                                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <p className="text-sm text-slate-300">{update.description}</p>
                                    <p className="text-xs text-slate-500 mt-2">
                                        - {update.author} em {new Date(update.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="mt-auto pt-4 border-t border-slate-700/50">
                <textarea
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    placeholder="Adicionar novo andamento..."
                    rows={3}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    disabled={isSubmitting}
                />
                <button type="submit" disabled={!newUpdate.trim() || isSubmitting} className="w-full mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Adicionando...' : 'Adicionar Andamento'}
                </button>
            </form>
        </div>
    );
};
