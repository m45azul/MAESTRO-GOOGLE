
import React, { useState, useMemo } from 'react';
import { Lead, PipelineStage } from '../types.ts';
import { KanbanColumn } from '../components/KanbanColumn.tsx';
import { AddLeadModal } from '../components/AddLeadModal.tsx';
import { PlusIcon, ChevronRightIcon } from '../components/icons.tsx';
import { ConvertLeadModal } from '../components/ConvertLeadModal.tsx';
import { TagFilter } from '../components/TagFilter.tsx';
import { LeadsFunnelChart } from '../components/LeadsFunnelChart.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

const STAGES: PipelineStage[] = ['Novo', 'Contatado', 'Qualificado', 'Proposta', 'Negociação', 'Ganho'];

export const CrmPage: React.FC = () => {
  const { data, isLoading, addLead, updateLead, deleteLead, convertLead } = useApi();
  const { leads = [], users: allUsers = [], tags = [] } = data || {};
  
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [distributionMode, setDistributionMode] = useState<'manual' | 'automatic'>('manual');
  const [lastAssignedSdrIndex, setLastAssignedSdrIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'funnel'>('kanban');

  // Filters
  const [responsibleFilter, setResponsibleFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  
  const activeLeads = useMemo(() => leads.filter(lead => !lead.isDeleted), [leads]);
  const sdrs = useMemo(() => allUsers.filter(u => u.role === 'SDR' && u.status === 'Ativo'), [allUsers]);
  const leadOrigins = useMemo(() => [...new Set(leads.map(l => l.origin))], [leads]);

  const filteredLeads = useMemo(() => {
    return activeLeads.filter(lead => {
        const responsibleMatch = responsibleFilter === 'all' || lead.responsibleId === responsibleFilter;
        const originMatch = originFilter === 'all' || lead.origin === originFilter;
        const tagsMatch = tagsFilter.length === 0 || tagsFilter.every(tagId => lead.tags.includes(tagId));
        return responsibleMatch && originMatch && tagsMatch;
    });
  }, [activeLeads, responsibleFilter, originFilter, tagsFilter]);

  const stageStats = useMemo(() => {
    let previousStageTotalValue = 0;
    const stats: Record<string, { totalValue: number; conversionRate: number | null, previousStageTotalValue: number }> = {};

    STAGES.forEach((stage, index) => {
      const leadsInStage = filteredLeads.filter(lead => lead.stage === stage);
      const totalValue = leadsInStage.reduce((sum, lead) => sum + lead.value, 0);

      let conversionRate: number | null = null;
      if (index > 0) {
        conversionRate = previousStageTotalValue > 0 ? (totalValue / previousStageTotalValue) * 100 : 0;
      }
      
      stats[stage] = { totalValue, conversionRate, previousStageTotalValue };
      previousStageTotalValue = totalValue;
    });
    return stats;
  }, [filteredLeads]);


  const handleAction = async (action: Promise<any>) => {
      setIsProcessing(true);
      try {
          await action;
      } finally {
          setIsProcessing(false);
      }
  };

  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDrop = async (targetStage: PipelineStage) => {
    if (!draggedLeadId) return;
    const leadToMove = leads.find(lead => lead.id === draggedLeadId);
    if (leadToMove && leadToMove.stage !== targetStage) {
        handleAction(updateLead({ ...leadToMove, stage: targetStage }));
    }
    setDraggedLeadId(null);
  };
  
  const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'stage'>) => {
    if (distributionMode === 'automatic' && sdrs.length > 0) {
        const nextSdrIndex = (lastAssignedSdrIndex + 1) % sdrs.length;
        const assignedSdr = sdrs[nextSdrIndex];
        newLeadData.responsibleId = assignedSdr.id;
        setLastAssignedSdrIndex(nextSdrIndex);
    }
    await handleAction(addLead(newLeadData));
  };
  
  const handleUpdateLead = async (updatedLead: Lead) => {
      await handleAction(updateLead(updatedLead));
      setIsEditModalOpen(false);
  };
  
  const handleDeleteLead = async (leadId: string) => {
      if (window.confirm("Tem certeza que deseja remover este lead?")) {
          await handleAction(deleteLead(leadId));
      }
  };
  
  const handleConvertLead = async (createCase: boolean, caseTitle: string, responsibleId: string) => {
      if (!selectedLead) return;
      await handleAction(convertLead(selectedLead, createCase, caseTitle, responsibleId));
      setIsConvertModalOpen(false);
  };
  
  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const openConvertModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConvertModalOpen(true);
  }

  if (isLoading) {
      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center"><SkeletonLoader className="h-10 w-1/3" /><SkeletonLoader className="h-10 w-28" /></div>
              <SkeletonLoader className="h-24 w-full" />
              <div className="flex items-start h-full gap-4">
                  {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="w-80 h-[60vh]" />)}
              </div>
          </div>
      )
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 px-1 gap-4">
        <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-300">Distribuição:</span>
                <div className="flex items-center p-1 bg-slate-800 rounded-lg">
                    <button 
                        onClick={() => setDistributionMode('manual')}
                        className={`px-3 py-1 text-sm rounded-md ${distributionMode === 'manual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        Manual
                    </button>
                    <button 
                        onClick={() => setDistributionMode('automatic')}
                        className={`px-3 py-1 text-sm rounded-md ${distributionMode === 'automatic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        Automática
                    </button>
                </div>
            </div>
             <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-300">Visualização:</span>
                <div className="flex items-center p-1 bg-slate-800 rounded-lg">
                    <button 
                        onClick={() => setViewMode('kanban')}
                        className={`px-3 py-1 text-sm rounded-md ${viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        Kanban
                    </button>
                    <button 
                        onClick={() => setViewMode('funnel')}
                        className={`px-3 py-1 text-sm rounded-md ${viewMode === 'funnel' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        Funil
                    </button>
                </div>
            </div>
        </div>
        <button
            onClick={() => { setSelectedLead(null); setIsAddModalOpen(true); }}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
            <PlusIcon className="w-5 h-5 mr-2"/>
            Novo Lead
        </button>
      </div>
       <div className="bg-slate-800/50 p-4 rounded-xl mb-6 border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TagFilter selectedTags={tagsFilter} onTagFilterChange={setTagsFilter} allTags={tags.filter(t => t.category === 'potencial' || t.category === 'area_atuacao')} />
            <div>
                 <label className="block text-sm font-medium text-slate-400 mb-2">Filtrar por SDR:</label>
                 <select value={responsibleFilter} onChange={e => setResponsibleFilter(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                    <option value="all">Todos os SDRs</option>
                    {sdrs.map(sdr => <option key={sdr.id} value={sdr.id}>{sdr.name}</option>)}
                 </select>
            </div>
            <div>
                 <label className="block text-sm font-medium text-slate-400 mb-2">Filtrar por Origem:</label>
                 <select value={originFilter} onChange={e => setOriginFilter(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                    <option value="all">Todas as Origens</option>
                    {leadOrigins.map(origin => <option key={origin} value={origin}>{origin}</option>)}
                 </select>
            </div>
        </div>
      </div>
      <div className="relative">
        {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/50 z-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
            </div>
        )}
        {viewMode === 'kanban' ? (
            <div className="flex items-start h-full overflow-x-auto p-1 -mx-1">
                {STAGES.map((stage, index) => (
                <React.Fragment key={stage}>
                    <KanbanColumn
                        stage={stage}
                        leads={filteredLeads.filter(lead => lead.stage === stage)}
                        onDrop={handleDrop}
                        onDragStart={handleDragStart}
                        onEdit={openEditModal}
                        onDelete={handleDeleteLead}
                        onConvert={openConvertModal}
                        totalValue={stageStats[stage].totalValue}
                        conversionRate={stageStats[stage].conversionRate}
                        previousStageTotalValue={stageStats[stage].previousStageTotalValue}
                    />
                    {index < STAGES.length - 1 && (
                        <div className="flex-shrink-0 w-12 h-full flex items-center justify-center pt-16">
                            <ChevronRightIcon className="w-6 h-6 text-slate-600"/>
                        </div>
                    )}
                </React.Fragment>
                ))}
            </div>
        ) : (
            <LeadsFunnelChart leads={filteredLeads} stages={STAGES} />
        )}
      </div>
      {(isAddModalOpen || isEditModalOpen) && (
        <AddLeadModal
            isOpen={isAddModalOpen || isEditModalOpen}
            onClose={() => {setIsAddModalOpen(false); setIsEditModalOpen(false);}}
            onSave={isEditModalOpen && selectedLead ? handleUpdateLead : handleAddLead}
            allUsers={allUsers}
            tags={tags}
            lead={selectedLead}
            distributionMode={distributionMode}
            isProcessing={isProcessing}
        />
      )}
      {isConvertModalOpen && selectedLead && (
          <ConvertLeadModal
            isOpen={isConvertModalOpen}
            onClose={() => setIsConvertModalOpen(false)}
            lead={selectedLead}
            onConvert={handleConvertLead}
            allUsers={allUsers}
            isProcessing={isProcessing}
          />
      )}
    </>
  );
};
