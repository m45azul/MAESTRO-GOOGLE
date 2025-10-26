import React from 'react';
import type { Lead, PipelineStage } from '../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  onDrop: (stage: PipelineStage) => void;
  onDragStart: (leadId: string) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onConvert: (lead: Lead) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, leads, onDrop, onDragStart, onEdit, onDelete, onConvert }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(stage);
  };
  
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-shrink-0 w-80 h-full bg-slate-800/80 rounded-xl flex flex-col"
    >
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="font-semibold text-white flex items-center">
          {stage}
          <span className="ml-2 text-sm text-slate-400 bg-slate-700 rounded-full px-2 py-0.5">
            {leads.length}
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Valor Total: R$ {totalValue.toLocaleString('pt-BR')}
        </p>
      </div>
      <div className="p-2 space-y-2 overflow-y-auto flex-1">
        {leads.map(lead => (
          <KanbanCard 
            key={lead.id} 
            lead={lead} 
            onDragStart={onDragStart}
            onEdit={onEdit}
            onDelete={onDelete}
            onConvert={onConvert}
          />
        ))}
      </div>
    </div>
  );
};