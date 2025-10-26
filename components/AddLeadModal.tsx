import React, { useState } from 'react';
import type { Lead, User } from '../types';
import { mockTags } from '../data/tags';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'stage'>) => void;
  sdrs: User[];
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAddLead, sdrs }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [responsibleId, setResponsibleId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLead({
      name,
      company,
      value: parseFloat(value) || 0,
      responsibleId,
      tags,
    });
    onClose();
    // Reset form
    setName('');
    setCompany('');
    setValue('');
    setResponsibleId(null);
    setTags([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-lg border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6">Adicionar Novo Lead</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">Nome do Lead</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300">Empresa</label>
                <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-slate-300">Valor Estimado (R$)</label>
                <input type="number" id="value" value={value} onChange={e => setValue(e.target.value)} step="0.01" className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="responsible" className="block text-sm font-medium text-slate-300">Atribuir a SDR</label>
                <select id="responsible" value={responsibleId || ''} onChange={e => setResponsibleId(e.target.value || null)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option value="">Não atribuído</option>
                  {sdrs.map(sdr => <option key={sdr.id} value={sdr.id}>{sdr.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Salvar Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};
