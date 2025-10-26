import React, { useState } from 'react';
import type { LegalCase, User, Client } from '../types';

interface AddCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCase: (newCase: Omit<LegalCase, 'id' | 'status' | 'updates'>) => void;
  lawyers: User[];
  clients: Client[];
}

export const AddCaseModal: React.FC<AddCaseModalProps> = ({ isOpen, onClose, onAddCase, lawyers, clients }) => {
    const [title, setTitle] = useState('');
    const [caseNumber, setCaseNumber] = useState('');
    const [clientId, setClientId] = useState('');
    const [responsibleId, setResponsibleId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !responsibleId) {
        alert("Por favor, selecione um cliente e um advogado responsável.");
        return;
    }
    onAddCase({
        title,
        caseNumber,
        clientId,
        responsibleId,
        tags: [], // Tags can be added later
        valorCausa: 0, // Default values for MVP
        honorariosPrevistos: 0,
        percentualAdvogado: 30,
    });
    onClose();
    // Reset form
    setTitle('');
    setCaseNumber('');
    setClientId('');
    setResponsibleId('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-lg border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6">Adicionar Novo Processo</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">Título do Processo</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="caseNumber" className="block text-sm font-medium text-slate-300">Número do Processo</label>
                <input type="text" id="caseNumber" value={caseNumber} onChange={e => setCaseNumber(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-slate-300">Cliente</label>
                <select id="client" value={clientId} onChange={e => setClientId(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option value="" disabled>Selecione um cliente</option>
                  {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="responsible" className="block text-sm font-medium text-slate-300">Advogado Responsável</label>
              <select id="responsible" value={responsibleId} onChange={e => setResponsibleId(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                <option value="" disabled>Selecione um advogado</option>
                {lawyers.map(lawyer => <option key={lawyer.id} value={lawyer.id}>{lawyer.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Salvar Processo</button>
          </div>
        </form>
      </div>
    </div>
  );
};
