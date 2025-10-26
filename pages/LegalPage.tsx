import React, { useState, useMemo } from 'react';
import type { LegalCase, TimeLog, User } from '../types';
import { CaseList } from '../components/CaseList';
import { CaseDetails } from '../components/CaseDetails';
import { useAuth } from '../context/AuthContext';
import { mockClients } from '../data/clients';
import { AddCaseModal } from '../components/AddCaseModal';

interface LegalPageProps {
    cases: LegalCase[];
    setCases: React.Dispatch<React.SetStateAction<LegalCase[]>>;
    allUsers: User[];
}

export const LegalPage: React.FC<LegalPageProps> = ({ cases, setCases, allUsers }) => {
    const { user } = useAuth();
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(cases.find(c => !c.isDeleted)?.id || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<LegalCase | null>(null);

    const activeCases = useMemo(() => cases.filter(c => !c.isDeleted), [cases]);

    const filteredCases = useMemo(() => {
        return activeCases.filter(c => {
            const clientName = mockClients.find(client => client.id === c.clientId)?.name || '';
            return searchTerm === '' ||
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                clientName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [activeCases, searchTerm]);

    const selectedCase = useMemo(() => {
        return cases.find(c => c.id === selectedCaseId);
    }, [cases, selectedCaseId]);

    const handleAddUpdate = (caseId: string, description: string) => {
        if(!user) return;
        setCases(prevCases => prevCases.map(c => {
            if (c.id === caseId) {
                const newUpdate = {
                    id: `u${caseId}-${c.updates.length + 1}`,
                    date: new Date().toISOString().split('T')[0],
                    author: user.name,
                    description: description,
                };
                return { ...c, updates: [...c.updates, newUpdate] };
            }
            return c;
        }));
    };

    const handleAddTimeLog = (caseId: string, timeLogData: Omit<TimeLog, 'id' | 'status'>) => {
        setCases(prevCases => prevCases.map(c => {
            if (c.id === caseId) {
                const newTimeLog: TimeLog = {
                    ...timeLogData,
                    id: `tl-${caseId}-${c.timesheet.length + 1}`,
                    status: 'Pendente',
                };
                return { ...c, timesheet: [...c.timesheet, newTimeLog] };
            }
            return c;
        }));
    };
    
    const handleUpdateTimeLogStatus = (caseId: string, timeLogId: string, status: TimeLog['status']) => {
        setCases(prevCases => prevCases.map(c => {
            if (c.id === caseId) {
                return { 
                    ...c, 
                    timesheet: c.timesheet.map(tl => tl.id === timeLogId ? {...tl, status} : tl)
                };
            }
            return c;
        }));
    };
    
    const handleReassignCase = (caseId: string, newResponsibleId: string, reason: string) => {
      if(!user) return;
      setCases(prevCases => prevCases.map(c => {
        if (c.id === caseId) {
          const newResponsible = allUsers.find(u => u.id === newResponsibleId);
          const oldResponsible = allUsers.find(u => u.id === c.responsibleId);
          const updateDescription = `Processo reatribuído de ${oldResponsible?.name || 'N/A'} para ${newResponsible?.name || 'N/A'}. Motivo: ${reason}`;
          const newUpdate = {
              id: `u${caseId}-${c.updates.length + 1}`,
              date: new Date().toISOString().split('T')[0],
              author: user.name,
              description: updateDescription,
          };
          return { ...c, responsibleId: newResponsibleId, updates: [...c.updates, newUpdate] };
        }
        return c;
      }));
    };

    const handleSaveCase = (caseData: Omit<LegalCase, 'id' | 'status' | 'updates'> & { id?: string }) => {
        if(editingCase) { // Update
            setCases(prev => prev.map(c => c.id === editingCase.id ? { ...c, ...caseData } : c));
        } else { // Create
             const newCase: LegalCase = {
                ...caseData,
                id: `case-${Date.now()}`,
                status: 'Ativo',
                updates: [{
                    id: 'update-1', date: new Date().toISOString().split('T')[0],
                    author: 'Sistema', description: 'Processo criado no sistema.'
                }]
            };
            setCases(prev => [newCase, ...prev]);
        }
        setEditingCase(null);
    };

    const handleArchiveCase = (caseId: string) => {
        if(window.confirm("Tem certeza que deseja arquivar este processo?")) {
            setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'Arquivado' } : c));
            if (selectedCaseId === caseId) {
                setSelectedCaseId(activeCases.length > 1 ? activeCases.find(c => c.id !== caseId)?.id || null : null);
            }
        }
    };
    
    const openAddModal = () => {
        setEditingCase(null);
        setIsModalOpen(true);
    };

    const openEditModal = (caseToEdit: LegalCase) => {
        setEditingCase(caseToEdit);
        setIsModalOpen(true);
    };
    
    const lawyers = useMemo(() => allUsers.filter(u => u.role === 'Advogado Interno' || u.role === 'Controller' || u.role === 'Advogado Parceiro'), [allUsers]);

    return (
        <>
            <div className="flex h-[calc(100vh-8rem)]">
                <div className="w-2/5 xl:w-1/3 border-r border-slate-700/50 pr-4 flex flex-col">
                    <CaseList
                        cases={filteredCases}
                        selectedCaseId={selectedCaseId}
                        onSelectCase={setSelectedCaseId}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddCaseClick={openAddModal}
                    />
                </div>
                <div className="w-3/5 xl:w-2/3 pl-4">
                    <CaseDetails 
                        caseData={selectedCase} 
                        onAddUpdate={handleAddUpdate}
                        onEdit={openEditModal}
                        onArchive={handleArchiveCase}
                        onAddTimeLog={handleAddTimeLog}
                        onUpdateTimeLogStatus={handleUpdateTimeLogStatus}
                        onReassign={handleReassignCase}
                        allUsers={allUsers}
                    />
                </div>
            </div>
            {isModalOpen && (
                <AddCaseModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSaveCase={handleSaveCase}
                    lawyers={lawyers}
                    clients={mockClients}
                    caseData={editingCase}
                />
            )}
        </>
    );
};