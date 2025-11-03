
import React, { useState, useMemo, useEffect } from 'react';
import { LegalCase, TimeLog, Document } from '../types.ts';
import { CaseList } from '../components/CaseList.tsx';
import { CaseDetails } from '../components/CaseDetails.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { AddCaseModal } from '../components/AddCaseModal.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';
import { Card } from '../components/Card.tsx';

type CaseStatusFilter = LegalCase['status'] | 'Todos';

export const LegalPage: React.FC = () => {
    const { user } = useAuth();
    const { data, isLoading, saveCase, archiveCase, addCaseUpdate, addTimeLog, updateTimeLogStatus, syncCaseWithCourt, uploadDocument, analyzeDocument } = useApi();
    const { cases = [], users: allUsers = [], clients = [], tags = [] } = data || {};

    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<CaseStatusFilter>('Ativo');
    const [responsibleFilter, setResponsibleFilter] = useState<string>('all');
    const [tagsFilter, setTagsFilter] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<LegalCase | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);
    const lawyers = useMemo(() => allUsers.filter(u => u.role.includes('Advogado') || u.role === 'Controller'), [allUsers]);
    const caseTags = useMemo(() => tags.filter(t => t.category === 'area_atuacao' || t.category === 'prioridade'), [tags]);

    const activeCases = useMemo(() => cases.filter(c => !c.isDeleted), [cases]);

    const filteredCases = useMemo(() => {
        return activeCases.filter(c => {
            const statusMatch = statusFilter === 'Todos' || c.status === statusFilter;
            const responsibleMatch = responsibleFilter === 'all' || c.responsibleId === responsibleFilter;
            const tagsMatch = tagsFilter.length === 0 || tagsFilter.every(tagId => c.tags.includes(tagId));
            
            if (!statusMatch || !responsibleMatch || !tagsMatch) return false;

            if (!searchTerm.trim()) return true;
            
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const clientName = clientMap.get(c.clientId)?.name || '';
            return (
                c.title.toLowerCase().includes(lowercasedSearchTerm) ||
                c.processNumber.toLowerCase().includes(lowercasedSearchTerm) ||
                (c.internalNumber && c.internalNumber.toLowerCase().includes(lowercasedSearchTerm)) ||
                clientName.toLowerCase().includes(lowercasedSearchTerm)
            );
        });
    }, [activeCases, searchTerm, statusFilter, clientMap, responsibleFilter, tagsFilter]);
    
    // Effect to manage the selected case ID.
    // It selects the first case initially, and also resets the selection
    // if the current one is filtered out.
    useEffect(() => {
        const isSelectedCaseInList = filteredCases.some(c => c.id === selectedCaseId);
        
        if (filteredCases.length > 0 && !isSelectedCaseInList) {
            setSelectedCaseId(filteredCases[0].id);
        } else if (filteredCases.length === 0) {
            setSelectedCaseId(null);
        }
    }, [filteredCases, selectedCaseId]);

    const selectedCase = useMemo(() => {
        // This is now a pure lookup based on the ID.
        return cases.find(c => c.id === selectedCaseId);
    }, [cases, selectedCaseId]);


    const handleAction = async (action: Promise<any>) => {
        setIsProcessing(true);
        try {
            await action;
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleSaveCase = async (caseData: Omit<LegalCase, 'id'> & { id?: string }) => {
        await handleAction(saveCase(caseData));
        setEditingCase(null);
        setIsModalOpen(false);
    };

    const handleArchiveCase = async (caseId: string) => {
        if(window.confirm("Tem certeza que deseja arquivar este processo?")) {
            await handleAction(archiveCase(caseId));
            if (selectedCaseId === caseId) {
                const newCaseToSelect = cases.find(c => c.id !== caseId && c.status === 'Ativo');
                setSelectedCaseId(newCaseToSelect?.id || null);
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
    
    if (isLoading) {
        return (
            <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-8rem)] gap-4">
                <SkeletonLoader className="w-full lg:w-2/5 xl:w-1/3 h-full" />
                <SkeletonLoader className="w-full lg:w-3/5 xl:w-2/3 h-full" />
            </div>
        );
    }
    
    return (
        <>
            <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-8rem)] gap-4">
                <div className="w-full lg:w-2/5 xl:w-1/3 h-1/2 lg:h-full flex flex-col">
                    <CaseList
                        cases={filteredCases}
                        selectedCaseId={selectedCaseId}
                        onSelectCase={setSelectedCaseId}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onAddCaseClick={openAddModal}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        clientMap={clientMap}
                        responsibleFilter={responsibleFilter}
                        onResponsibleFilterChange={setResponsibleFilter}
                        tagsFilter={tagsFilter}
                        onTagsFilterChange={setTagsFilter}
                        allLawyers={lawyers}
                        allTags={caseTags}
                    />
                </div>
                <div className="w-full lg:w-3/5 xl:w-2/3 h-1/2 lg:h-full relative">
                     {isProcessing && (
                        <div className="absolute inset-0 bg-slate-900/50 z-20 flex items-center justify-center rounded-xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                        </div>
                    )}
                    {filteredCases.length === 0 && !isLoading ? (
                         <Card className="h-full flex items-center justify-center text-slate-500">Nenhum processo encontrado para os filtros selecionados.</Card>
                    ) : (
                        <CaseDetails 
                            caseData={selectedCase} 
                            onAddUpdate={(caseId, authorId, desc) => handleAction(addCaseUpdate(caseId, authorId, desc))}
                            onEdit={openEditModal}
                            onArchive={handleArchiveCase}
                            onAddTimeLog={(caseId, log) => handleAction(addTimeLog(caseId, log))}
                            onUpdateTimeLogStatus={(caseId, logId, status) => handleAction(updateTimeLogStatus(caseId, logId, status))}
                            onReassign={() => {}} 
                            allUsers={allUsers}
                            clientMap={clientMap}
                            onSyncCaseWithCourt={(caseId) => handleAction(syncCaseWithCourt(caseId))}
                            onUploadDocument={(caseId, file) => uploadDocument(caseId, file)}
                            onAnalyzeDocument={(caseId, docId) => handleAction(analyzeDocument(caseId, docId))}
                        />
                    )}
                </div>
            </div>
            {isModalOpen && (
                <AddCaseModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSaveCase={handleSaveCase}
                    lawyers={lawyers}
                    clients={clients}
                    tags={tags}
                    caseData={editingCase}
                />
            )}
        </>
    );
};
