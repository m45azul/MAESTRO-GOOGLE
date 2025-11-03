import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card.tsx';
import { Client } from '../types.ts';
import { ClientList } from '../components/ClientList.tsx';
import { ClientDetails } from '../components/ClientDetails.tsx';
import { AddClientModal } from '../components/AddClientModal.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

export const ClientsPage: React.FC = () => {
    const { user } = useAuth();
    const { data, isLoading, addClientNote, editClientNote, deleteClientNote } = useApi();
    const { clients = [], cases = [] } = data || {};
    
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const activeClients = useMemo(() => clients.filter(c => !c.isDeleted), [clients]);
    
     // Effect to set initial selected client
    React.useEffect(() => {
        if (!selectedClientId && activeClients.length > 0) {
            setSelectedClientId(activeClients[0].id);
        }
    }, [activeClients, selectedClientId]);

    const selectedClient = useMemo(() => {
        return clients.find(c => c.id === selectedClientId);
    }, [clients, selectedClientId]);

    const handleSaveClient = async (clientData: Client) => {
        // This should be an API call in a real app - not implemented in ApiContext yet
        console.log("Save client not implemented via API yet", clientData);
        setIsEditModalOpen(false);
    };

    const handleDeactivateClient = (clientId: string) => {
        if (window.confirm("Tem certeza que deseja desativar este cliente?")) {
            // This should be an API call - not implemented in ApiContext yet
            console.log("Deactivate client not implemented via API yet");
            if(selectedClientId === clientId) {
                setSelectedClientId(activeClients.length > 1 ? activeClients.find(c => c.id !== clientId)?.id || null : null);
            }
        }
    };
    
    const handleAction = async (action: Promise<any>) => {
        setIsProcessing(true);
        try {
            await action;
        } catch (error) {
            console.error("Client action failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddNote = async (clientId: string, content: string) => {
        if (!user) return;
        await handleAction(addClientNote(clientId, user.id, content));
    };

    const handleEditNote = async (clientId: string, noteId: string, content: string) => {
        await handleAction(editClientNote(clientId, noteId, content));
    };
    
    const handleDeleteNote = async (clientId: string, noteId: string) => {
        await handleAction(deleteClientNote(clientId, noteId));
    };
    
    const openEditModal = () => {
        if(selectedClient) {
            setIsEditModalOpen(true);
        }
    };

    if (isLoading) {
        return (
             <div className="flex h-[calc(100vh-8rem)] gap-6">
                <SkeletonLoader className="w-1/3 h-full" />
                <SkeletonLoader className="w-2/3 h-full" />
            </div>
        );
    }

    return (
        <>
            <div className="flex h-[calc(100vh-8rem)] gap-6">
                <div className="w-1/3 h-full">
                    <ClientList 
                        clients={activeClients}
                        selectedClientId={selectedClientId}
                        onSelectClient={setSelectedClientId}
                    />
                </div>
                <div className="w-2/3 h-full relative">
                    {isProcessing && (
                        <div className="absolute inset-0 bg-slate-900/50 z-20 flex items-center justify-center rounded-xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                        </div>
                    )}
                    <ClientDetails 
                        client={selectedClient}
                        cases={cases.filter(c => c.clientId === selectedClientId)}
                        onEdit={openEditModal}
                        onDeactivate={handleDeactivateClient}
                        onAddNote={handleAddNote}
                        onEditNote={handleEditNote}
                        onDeleteNote={handleDeleteNote}
                    />
                </div>
            </div>
            {isEditModalOpen && selectedClient && (
                <AddClientModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveClient}
                    client={selectedClient}
                />
            )}
        </>
    );
};