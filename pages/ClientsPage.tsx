
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Client, LegalCase } from '../types';
import { ClientList } from '../components/ClientList';
import { ClientDetails } from '../components/ClientDetails';
import { AddClientModal } from '../components/AddClientModal';

interface ClientsPageProps {
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    cases: LegalCase[];
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ clients, setClients, cases }) => {
    const [selectedClientId, setSelectedClientId] = useState<string | null>(clients.length > 0 ? clients[0].id : null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const activeClients = React.useMemo(() => clients.filter(c => !c.isDeleted), [clients]);
    
    const selectedClient = React.useMemo(() => {
        return clients.find(c => c.id === selectedClientId);
    }, [clients, selectedClientId]);

    const handleSaveClient = (clientData: Client) => {
        setClients(prev => prev.map(c => c.id === clientData.id ? clientData : c));
        setIsEditModalOpen(false);
    };

    const handleDeactivateClient = (clientId: string) => {
        if (window.confirm("Tem certeza que deseja desativar este cliente?")) {
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, isDeleted: true } : c));
            if(selectedClientId === clientId) {
                setSelectedClientId(activeClients.length > 1 ? activeClients.find(c => c.id !== clientId)?.id || null : null);
            }
        }
    };
    
    const openEditModal = () => {
        if(selectedClient) {
            setIsEditModalOpen(true);
        }
    };

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
                <div className="w-2/3 h-full">
                    <ClientDetails 
                        client={selectedClient}
                        cases={cases.filter(c => c.clientId === selectedClientId)}
                        onEdit={openEditModal}
                        onDeactivate={handleDeactivateClient}
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
