import React, { useState } from 'react';
import { Card } from './Card';
import { Client } from '../types';
import { UsersIcon } from './icons';

interface ClientListProps {
    clients: Client[];
    selectedClientId: string | null;
    onSelectClient: (id: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ clients, selectedClientId, onSelectClient }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cpfCnpj.includes(searchTerm)
    );

    return (
        <Card className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <UsersIcon className="w-6 h-6 mr-3 text-indigo-400" />
                    Clientes
                </h2>
            </div>
            <input
                type="text"
                placeholder="Buscar por nome ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <div className="overflow-y-auto flex-1 pr-2">
                {filteredClients.map(client => (
                    <button
                        key={client.id}
                        onClick={() => onSelectClient(client.id)}
                        className={`w-full text-left p-3 mb-2 rounded-lg cursor-pointer transition-colors border-l-4 ${
                            selectedClientId === client.id
                                ? 'bg-slate-700 border-indigo-500'
                                : 'bg-slate-800/50 hover:bg-slate-700/50 border-transparent'
                        }`}
                    >
                        <p className="font-bold text-sm text-slate-200">{client.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{client.type} - {client.cpfCnpj}</p>
                    </button>
                ))}
            </div>
        </Card>
    );
};
