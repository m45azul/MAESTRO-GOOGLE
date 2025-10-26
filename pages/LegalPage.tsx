import React, { useState, useMemo } from 'react';
import type { LegalCase } from '../types';
import { CaseList } from '../components/CaseList';
import { CaseDetails } from '../components/CaseDetails';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/users';
import { mockClients } from '../data/clients';
import { AddCaseModal } from '../components/AddCaseModal';

interface LegalPageProps {
    cases: LegalCase[];
    setCases: React.Dispatch<React.SetStateAction<LegalCase[]>>;
}

export const LegalPage: React.FC<LegalPageProps> = ({ cases, setCases }) => {
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
                c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'Arquivado', isDeleted: true } : c));
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
    
    const lawyers = useMemo(() => mockUsers.filter(u => u.role === 'Advogado Interno' || u.role === 'Controller'), []);

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