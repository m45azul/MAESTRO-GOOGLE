import React, { useState } from 'react';
import { LegalCase } from '../types';
import { FileTextIcon } from './icons';

interface CaseUpdatesTabProps {
  caseData: LegalCase;
  onAddUpdate: (caseId: string, description: string) => void;
}

export const CaseUpdatesTab: React.FC<CaseUpdatesTabProps> = ({ caseData, onAddUpdate }) => {
  const [newUpdate, setNewUpdate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUpdate.trim()) {
      onAddUpdate(caseData.id, newUpdate);
      setNewUpdate('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 mb-4">
        <div className="relative border-l-2 border-slate-700 ml-2">
          {caseData.updates.slice().reverse().map((update) => (
            <div key={update.id} className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full -left-3 ring-4 ring-slate-800">
                <FileTextIcon className="w-3 h-3 text-indigo-400" />
              </span>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="text-sm text-slate-300">{update.description}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(update.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} por {update.author}
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
    </div>
  );
};