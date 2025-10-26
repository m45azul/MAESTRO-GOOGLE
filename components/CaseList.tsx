import React from 'react';
import type { LegalCase } from '../types';
import { Card } from './Card';
import { clientMap } from '../data/clients';
import { PlusIcon } from './icons';


interface CaseListProps {
  cases: LegalCase[];
  selectedCaseId: string | null;
  onSelectCase: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddCaseClick: () => void;
}

const getStatusColor = (status: LegalCase['status']) => {
  switch (status) {
    case 'Ativo': return 'bg-green-500';
    case 'Suspenso': return 'bg-yellow-500';
    case 'Arquivado': return 'bg-slate-500';
  }
};

export const CaseList: React.FC<CaseListProps> = ({ cases, selectedCaseId, onSelectCase, searchTerm, onSearchChange, onAddCaseClick }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Processos</h2>
         <button
            onClick={onAddCaseClick}
            className="flex items-center justify-center px-3 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
            <PlusIcon className="w-4 h-4 mr-2"/>
            Novo Processo
        </button>
      </div>
      <input
        type="text"
        placeholder="Buscar por nº, título ou cliente..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
      <div className="overflow-y-auto flex-1 pr-2">
        {cases.map(c => (
          <div
            key={c.id}
            onClick={() => onSelectCase(c.id)}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors border-l-4 ${
              selectedCaseId === c.id
                ? 'bg-slate-700 border-indigo-500'
                : 'bg-slate-800/50 hover:bg-slate-700/50 border-transparent'
            }`}
          >
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-sm text-slate-200">{c.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{c.caseNumber}</p>
                </div>
                <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getStatusColor(c.status)}`} title={c.status}></span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Cliente: {clientMap.get(c.clientId)?.name || 'N/A'}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
