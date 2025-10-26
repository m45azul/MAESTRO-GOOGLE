import React from 'react';
import { Card } from './Card';
import { Client, LegalCase } from '../types';
import { EditIcon, TrashIcon } from './icons';

interface ClientDetailsProps {
    client?: Client;
    cases: LegalCase[];
    onEdit: () => void;
    onDeactivate: (clientId: string) => void;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ client, cases, onEdit, onDeactivate }) => {
    if (!client) {
        return <Card className="h-full flex items-center justify-center text-slate-500">Selecione um cliente para ver os detalhes</Card>;
    }

    return (
        <Card className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-700/50 pb-4 mb-4">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-white pr-8">{client.name}</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={onEdit} className="text-slate-400 hover:text-indigo-400 p-1" title="Editar Cliente">
                            <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDeactivate(client.id)} className="text-slate-400 hover:text-red-400 p-1" title="Desativar Cliente">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <p className="text-sm text-slate-400 mt-1">{client.type}</p>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-400 mt-3">
                    <span><span className="font-semibold text-slate-300">CPF/CNPJ:</span> {client.cpfCnpj}</span>
                    <span><span className="font-semibold text-slate-300">Email:</span> {client.email}</span>
                    <span><span className="font-semibold text-slate-300">Telefone:</span> {client.phone}</span>
                     <span><span className="font-semibold text-slate-300">Cliente desde:</span> {new Date(client.conversionDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                </div>
            </div>

            {/* Cases */}
            <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-lg font-semibold text-white mb-4">Processos Vinculados ({cases.length})</h3>
                <div className="overflow-y-auto flex-1 pr-2">
                    {cases.length > 0 ? cases.map(c => (
                        <div key={c.id} className="p-3 mb-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <p className="font-bold text-sm text-slate-200">{c.title}</p>
                            <p className="text-xs text-slate-400 mt-1">{c.processNumber}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                    {c.status}
                                </span>
                                <span className="text-xs text-slate-400">Valor: R$ {c.valorCausa.toLocaleString('pt-BR')}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                           <p>Nenhum processo vinculado a este cliente.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
