import React, { useState } from 'react';
import type { Lead } from '../types';
import { userMap } from '../data/users';
import { MoreVerticalIcon, EditIcon, TrashIcon } from './icons';

interface KanbanCardProps {
  lead: Lead;
  onDragStart: (leadId: string) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onConvert: (lead: Lead) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead, onDragStart, onEdit, onDelete, onConvert }) => {
  const owner = lead.responsibleId ? userMap.get(lead.responsibleId) : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    onDragStart(lead.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-4 bg-slate-700/50 rounded-lg shadow-md cursor-grab active:cursor-grabbing border border-slate-600/50 hover:bg-slate-700 transition-colors relative"
    >
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-slate-100 text-sm pr-6">{lead.name}</h4>
        <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="absolute -top-2 -right-2 text-slate-400 hover:text-white">
                <MoreVerticalIcon className="w-4 h-4" />
            </button>
            {isMenuOpen && (
                <div className="absolute top-5 right-0 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-10 w-32">
                    <button onClick={() => { onEdit(lead); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"><EditIcon className="w-4 h-4 mr-2" /> Editar</button>
                    <button onClick={() => { onDelete(lead.id); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700"><TrashIcon className="w-4 h-4 mr-2" /> Excluir</button>
                </div>
            )}
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-1">{lead.company}</p>
      <div className="flex justify-between items-end mt-3">
        <p className="text-sm font-semibold text-indigo-300">
          R$ {lead.value.toLocaleString('pt-BR')}
        </p>
        {owner && (
          <img
            src={owner.avatarUrl}
            alt={owner.name}
            className="w-6 h-6 rounded-full ring-2 ring-slate-600"
            title={`Responsável: ${owner.name}`}
          />
        )}
      </div>
      {lead.stage === 'Ganho' && (
          <button onClick={() => onConvert(lead)} className="mt-3 w-full text-center text-xs font-bold bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-md transition-colors">
              Converter em Cliente
          </button>
      )}
    </div>
  );
};