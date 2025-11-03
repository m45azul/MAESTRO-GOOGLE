

import React from 'react';
import { Lead, PipelineStage } from '../types.ts';
import { KanbanCard } from './KanbanCard.tsx';

interface KanbanColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  onDrop: (stage: PipelineStage) => Promise<void>;
  onDragStart: (leadId: string) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => Promise<void>;
  onConvert: (lead: Lead) => void;
  totalValue: number;
  conversionRate: number | null;
  previousStageTotalValue: number;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, leads, onDrop, onDragStart, onEdit, onDelete, onConvert, totalValue, conversionRate, previousStageTotalValue }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    await onDrop(stage);
  };

  const funnelWidthPercentage = previousStageTotalValue > 0 ? (totalValue / previousStageTotalValue) * 100 : 100;

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-shrink-0 w-80 h-full bg-slate-800/80 rounded-xl flex flex-col"
    >
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center">
            {stage}
            <span className="ml-2 text-sm text-slate-400 bg-slate-700 rounded-full px-2 py-0.5">
                {leads.length}
            </span>
            </h3>
            {conversionRate !== null && (
                <span className={`text-xs font-bold ${conversionRate >= 50 ? 'text-green-400' : 'text-amber-400'}`}>
                    {conversionRate.toFixed(1)}%
                </span>
            )}
        </div>
        <p className="text-sm font-bold text-indigo-300 mt-1">
          R$ {totalValue.toLocaleString('pt-BR')}
        </p>
        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${funnelWidthPercentage}%` }}></div>
        </div>
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