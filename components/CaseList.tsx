

import React, { useState } from 'react';
import { Client, LegalCase, User, Tag } from '../types.ts';
import { Card } from './Card.tsx';
import { PlusIcon } from './icons.tsx';
import { TagFilter } from './TagFilter.tsx';

type CaseStatusFilter = LegalCase['status'] | 'Todos';

interface CaseListProps {
  cases: LegalCase[];
  selectedCaseId: string | null;
  onSelectCase: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddCaseClick: () => void;
  statusFilter: CaseStatusFilter;
  onStatusFilterChange: (status: CaseStatusFilter) => void;
  clientMap: Map<string, Client>;
  responsibleFilter: string;
  onResponsibleFilterChange: (id: string) => void;
  tagsFilter: string[];
  onTagsFilterChange: (tagIds: string[]) => void;
  allLawyers: User[];
  allTags: Tag[];
}

const getStatusBorderColor = (status: LegalCase['status']) => {
  switch (status) {
    case 'Ativo': return 'border-green-500';
    case 'Suspenso': return 'border-yellow-500';
    case 'Arquivado': return 'border-slate-500';
  }
};

const STATUS_FILTERS: CaseStatusFilter[] = ['Ativo', 'Suspenso', 'Arquivado', 'Todos'];

export const CaseList: React.FC<CaseListProps> = ({ cases, selectedCaseId, onSelectCase, searchTerm, onSearchChange, onAddCaseClick, statusFilter, onStatusFilterChange, clientMap, responsibleFilter, onResponsibleFilterChange, tagsFilter, onTagsFilterChange, allLawyers, allTags }) => {
  const [hoveredCaseId, setHoveredCaseId] = useState<string | null>(null);

  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Processos</h2>
        <button
          onClick={onAddCaseClick}
          className="flex items-center justify-center p-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          title="Adicionar Novo Processo"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Buscar por título, nº ou cliente..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-400 mb-1">Responsável:</label>
        <select value={responsibleFilter} onChange={e => onResponsibleFilterChange(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
           <option value="all">Todos os Advogados</option>
           {allLawyers.map(lawyer => <option key={lawyer.id} value={lawyer.id}>{lawyer.name}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <TagFilter selectedTags={tagsFilter} onTagFilterChange={onTagsFilterChange} allTags={allTags} />
      </div>
       <div className="flex items-center justify-between mb-4 p-1 bg-slate-800 rounded-lg">
          {STATUS_FILTERS.map(status => (
              <button
                  key={status}
                  onClick={() => onStatusFilterChange(status)}
                  className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors ${
                      statusFilter === status ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'
                  }`}
              >
                  {status}
              </button>
          ))}
      </div>
      <div className="overflow-y-auto flex-1 pr-2">
        {cases.map(c => {
          const client = clientMap.get(c.clientId);
          return (
            <div
              key={c.id}
              className="relative"
              onMouseEnter={() => setHoveredCaseId(c.id)}
              onMouseLeave={() => setHoveredCaseId(null)}
            >
              <button
                onClick={() => onSelectCase(c.id)}
                className={`w-full text-left p-3 mb-2 rounded-lg cursor-pointer transition-colors border-l-4 ${
                  selectedCaseId === c.id
                    ? `bg-slate-700 border-indigo-500`
                    : `bg-slate-800/50 hover:bg-slate-700/50 ${getStatusBorderColor(c.status)}`
                }`}
              >
                <div className="flex justify-between items-start">
                    <p className="font-bold text-sm text-slate-200 pr-2">{c.title}</p>
                </div>
                <p className="text-xs text-slate-400 mt-1">{client?.name || 'Cliente não encontrado'}</p>
                <p className="text-xs text-slate-500 mt-1">{c.processNumber}</p>
              </button>
              {hoveredCaseId === c.id && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 z-20 p-3 bg-slate-900 border border-slate-600 rounded-lg shadow-xl animate-fade-in-fast pointer-events-none">
                    <p className="font-bold text-sm text-indigo-300 mb-2 border-b border-slate-700 pb-1">Detalhes Rápidos</p>
                    <div className="text-xs text-slate-300 space-y-1">
                        <p><span className="font-semibold text-slate-400">Cliente:</span> {client?.name || 'N/A'}</p>
                        <p><span className="font-semibold text-slate-400">Valor da Causa:</span> R$ {c.valorCausa.toLocaleString('pt-BR')}</p>
                    </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
