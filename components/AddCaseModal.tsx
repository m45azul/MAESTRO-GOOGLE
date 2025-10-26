import React, { useState, useEffect } from 'react';
import type { LegalCase, User, Client } from '../types';

interface AddCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCase: (caseData: Omit<LegalCase, 'id' | 'status' | 'updates'> & { id?: string }) => void;
  lawyers: User[];
  clients: Client[];
  caseData: LegalCase | null;
}

export const AddCaseModal: React.FC<AddCaseModalProps> = ({ isOpen, onClose, onSaveCase, lawyers, clients, caseData }) => {
    const [title, setTitle] = useState('');
    const [processNumber, setProcessNumber] = useState('');
    const [clientId, setClientId] = useState('');
    const [responsibleId, setResponsibleId] = useState('');
    const [opposingParty, setOpposingParty] = useState('');
    const [court, setCourt] = useState('');
    const [valorCausa, setValorCausa] = useState('');
    
    // Mock values from LegalCase that are not in the form
    const [honorariosPrevistos, setHonorariosPrevistos] = useState(0);
    const [percentualAdvogado, setPercentualAdvogado] = useState(30);
    const [tags, setTags] = useState<string[]>([]);

    const isEditing = !!caseData;

    useEffect(() => {
        if (isOpen && caseData) {
            setTitle(caseData.title);
            setProcessNumber(caseData.processNumber);
            setClientId(caseData.clientId);
            setResponsibleId(caseData.responsibleId);
            setOpposingParty(caseData.opposingParty);
            setCourt(caseData.court);
            setValorCausa(String(caseData.valorCausa));
            setHonorariosPrevistos(caseData.honorariosPrevistos);
            setPercentualAdvogado(caseData.percentualAdvogado);
            setTags(caseData.tags);
        } else {
            setTitle('');
            setProcessNumber('');
            setClientId('');
            setResponsibleId('');
            setOpposingParty('');
            setCourt('');
            setValorCausa('');
            setHonorariosPrevistos(0);
            setPercentualAdvogado(30);
            setTags([]);
        }
    }, [caseData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !responsibleId) {
        alert("Por favor, selecione um cliente e um advogado responsável.");
        return;
    }
    // FIX: The 'timesheet' property was missing, causing a type error. It's now included.
    onSaveCase({
        id: caseData?.id,
        title,
        processNumber,
        clientId,
        responsibleId,
        opposingParty,
        court,
        valorCausa: parseFloat(valorCausa) || 0,
        tags,
        honorariosPrevistos,
        percentualAdvogado,
        timesheet: caseData?.timesheet || [],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">{isEditing ? 'Editar Processo' : 'Adicionar Novo Processo'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">Título do Processo</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="processNumber" className="block text-sm font-medium text-slate-300">Número do Processo</label>
                <input type="text" id="processNumber" value={processNumber} onChange={e => setProcessNumber(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="valorCausa" className="block text-sm font-medium text-slate-300">Valor da Causa (R$)</label>
                <input type="number" id="valorCausa" value={valorCausa} onChange={e => setValorCausa(e.target.value)} step="0.01" className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="client" className="block text-sm font-medium text-slate-300">Cliente</label>
                    <select id="client" value={clientId} onChange={e => setClientId(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                    <option value="" disabled>Selecione um cliente</option>
                    {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="opposingParty" className="block text-sm font-medium text-slate-300">Parte Contrária</label>
                    <input type="text" id="opposingParty" value={opposingParty} onChange={e => setOpposingParty(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
            </div>
             <div>
                <label htmlFor="court" className="block text-sm font-medium text-slate-300">Tribunal / Vara</label>
                <input type="text" id="court" value={court} onChange={e => setCourt(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
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