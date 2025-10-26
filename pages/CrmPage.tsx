import React, { useState, useMemo } from 'react';
import type { Lead, PipelineStage, Client, Contract, LegalCase, User } from '../types';
import { KanbanColumn } from '../components/KanbanColumn';
import { AddLeadModal } from '../components/AddLeadModal';
import { PlusIcon } from '../components/icons';
import { ConvertLeadModal } from '../components/ConvertLeadModal';

const STAGES: PipelineStage[] = ['Novo', 'Contatado', 'Qualificado', 'Proposta', 'Negociação', 'Ganho'];

interface CrmPageProps {
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
    setCases: React.Dispatch<React.SetStateAction<LegalCase[]>>;
    allUsers: User[];
}

export const CrmPage: React.FC<CrmPageProps> = ({ leads, setLeads, setClients, setContracts, setCases, allUsers }) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [distributionMode, setDistributionMode] = useState<'manual' | 'automatic'>('manual');
  const [lastAssignedSdrIndex, setLastAssignedSdrIndex] = useState(-1);
  
  const activeLeads = useMemo(() => leads.filter(lead => !lead.isDeleted), [leads]);
  const sdrs = useMemo(() => allUsers.filter(u => u.role === 'SDR'), [allUsers]);

  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDrop = (targetStage: PipelineStage) => {
    if (!draggedLeadId) return;

    const leadToMove = leads.find(lead => lead.id === draggedLeadId);
    if (leadToMove && leadToMove.stage !== targetStage) {
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === draggedLeadId ? { ...lead, stage: targetStage } : lead
        )
      );
    }
    setDraggedLeadId(null);
  };
  
  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'stage'>) => {
    
    if (distributionMode === 'automatic' && sdrs.length > 0) {
        const nextSdrIndex = (lastAssignedSdrIndex + 1) % sdrs.length;
        const assignedSdr = sdrs[nextSdrIndex];
        newLeadData.responsibleId = assignedSdr.id;
        setLastAssignedSdrIndex(nextSdrIndex);
    }
    
    const newLead: Lead = {
        ...newLeadData,
        id: `lead-${Date.now()}`,
        stage: 'Novo',
    };
    setLeads(prev => [newLead, ...prev]);
  };
  
  const handleUpdateLead = (updatedLead: Lead) => {
      setLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
      setIsEditModalOpen(false);
  };
  
  const handleDeleteLead = (leadId: string) => {
      if (window.confirm("Tem certeza que deseja remover este lead?")) {
          setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, isDeleted: true } : lead));
      }
  };
  
  const handleConvertLead = (clientId: string, contractId: string, caseId: string | null) => {
      if (!selectedLead) return;
      // Mark lead as deleted (or converted)
      setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? { ...lead, isDeleted: true } : lead));
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

  return (
    <>
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-300">Distribuição de Leads:</span>
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
        <button
            onClick={() => { setSelectedLead(null); setIsAddModalOpen(true); }}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
            <PlusIcon className="w-5 h-5 mr-2"/>
            Novo Lead
        </button>
      </div>
      <div className="flex h-full overflow-x-auto space-x-4 p-1">
        {STAGES.map(stage => (
          <KanbanColumn
            key={stage}
            stage={stage}
            leads={activeLeads.filter(lead => lead.stage === stage)}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onEdit={openEditModal}
            onDelete={handleDeleteLead}
            onConvert={openConvertModal}
          />
        ))}
      </div>
      {(isAddModalOpen || isEditModalOpen) && (
        <AddLeadModal
            isOpen={isAddModalOpen || isEditModalOpen}
            onClose={() => {setIsAddModalOpen(false); setIsEditModalOpen(false);}}
            onSave={isEditModalOpen && selectedLead ? handleUpdateLead : handleAddLead}
            sdrs={sdrs}
            lead={selectedLead}
            distributionMode={distributionMode}
        />
      )}
      {isConvertModalOpen && selectedLead && (
          <ConvertLeadModal
            isOpen={isConvertModalOpen}
            onClose={() => setIsConvertModalOpen(false)}
            lead={selectedLead}
            setClients={setClients}
            setContracts={setContracts}
            setCases={setCases}
            onSuccess={handleConvertLead}
            allUsers={allUsers}
          />
      )}
    </>
  );
};