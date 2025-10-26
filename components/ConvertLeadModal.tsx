import React, { useState } from 'react';
import { Lead, Client, Contract, LegalCase, User } from '../types';
import { mockUsers } from '../data/users';

interface ConvertLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead;
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
    setCases: React.Dispatch<React.SetStateAction<LegalCase[]>>;
    onSuccess: (clientId: string, contractId: string, caseId: string | null) => void;
}

export const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({ isOpen, onClose, lead, setClients, setContracts, setCases, onSuccess }) => {
    const [createCase, setCreateCase] = useState(false);
    const [caseTitle, setCaseTitle] = useState(`Caso Inicial - ${lead.name}`);
    const [responsibleId, setResponsibleId] = useState('');
    
    const lawyers = mockUsers.filter(u => u.role === 'Advogado Interno' || u.role === 'Controller');

    const handleConvert = () => {
        // 1. Create Client
        const newClient: Client = {
            id: `client-${Date.now()}`,
            name: lead.name,
            email: `${lead.name.toLowerCase().replace(/\s/g, '.')}@cliente.com`, // mock email
            conversionDate: new Date().toISOString().split('T')[0],
            originLeadId: lead.id,
        };
        setClients(prev => [...prev, newClient]);
        
        // 2. Create Contract
        const newContract: Contract = {
            id: `contract-${Date.now()}`,
            clientId: newClient.id,
            type: 'Percentual', // Mock data for MVP
            value: lead.value,
            startDate: new Date().toISOString().split('T')[0],
        };
        setContracts(prev => [...prev, newContract]);
        
        let newCaseId: string | null = null;
        // 3. Optionally create Legal Case
        if (createCase && responsibleId) {
            const newCase: LegalCase = {
                id: `case-${Date.now()}`,
                caseNumber: `PROC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
                title: caseTitle,
                clientId: newClient.id,
                contractId: newContract.id,
                status: 'Ativo',
                responsibleId: responsibleId,
                updates: [{ id: 'u1', date: new Date().toISOString().split('T')[0], author: 'Sistema', description: 'Processo criado a partir da conversão do lead.' }],
                tags: lead.tags,
                valorCausa: lead.value * 1.5, // Mock
                honorariosPrevistos: lead.value,
                percentualAdvogado: 30, // Mock
            };
            setCases(prev => [...prev, newCase]);
            newCaseId = newCase.id;
        }
        
        onSuccess(newClient.id, newContract.id, newCaseId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-lg border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-2">Converter Lead em Cliente</h2>
                <p className="text-slate-400 mb-6">Convertendo: <span className="font-semibold text-slate-200">{lead.name}</span></p>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-sm font-medium text-slate-300">Novo Cliente:</p>
                        <p className="text-slate-200">{lead.name}</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-sm font-medium text-slate-300">Novo Contrato:</p>
                        <p className="text-slate-200">Tipo: Percentual, Valor: R$ {lead.value.toLocaleString('pt-BR')}</p>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                        <label className="flex items-center">
                            <input type="checkbox" checked={createCase} onChange={e => setCreateCase(e.target.checked)} className="h-4 w-4 rounded bg-slate-600 border-slate-500 text-indigo-600 focus:ring-indigo-500" />
                            <span className="ml-3 text-sm font-medium text-slate-200">Criar processo jurídico inicial</span>
                        </label>
                        {createCase && (
                            <div className="mt-4 space-y-4 pl-2 border-l-2 border-slate-600 ml-2">
                                <div>
                                    <label htmlFor="caseTitle" className="block text-xs font-medium text-slate-300">Título do Processo</label>
                                    <input type="text" id="caseTitle" value={caseTitle} onChange={e => setCaseTitle(e.target.value)} required={createCase} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="responsible" className="block text-xs font-medium text-slate-300">Advogado Responsável</label>
                                    <select id="responsible" value={responsibleId} onChange={e => setResponsibleId(e.target.value)} required={createCase} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                        <option value="" disabled>Selecione um advogado</option>
                                        {lawyers.map(lawyer => <option key={lawyer.id} value={lawyer.id}>{lawyer.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancelar</button>
                    <button onClick={handleConvert} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Confirmar Conversão</button>
                </div>
            </div>
        </div>
    );
};