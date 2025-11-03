import React, { useState, useEffect, useMemo } from 'react';
import { Lead, User, Tag } from '../types.ts';
import { TagFilter } from './TagFilter.tsx';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'stage'> | Lead) => Promise<void>;
  allUsers: User[];
  tags: Tag[];
  lead: Lead | null;
  distributionMode: 'manual' | 'automatic';
  isProcessing: boolean;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSave, allUsers, tags: allTags, lead, distributionMode, isProcessing }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [responsibleId, setResponsibleId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [origin, setOrigin] = useState('Indicação Parceiro');
  const [originPartnerId, setOriginPartnerId] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState('');

  const isEditing = !!lead;

  const { sdrs, partners } = useMemo(() => {
    const sdrs = allUsers.filter(u => u.role === 'SDR');
    const partners = allUsers.filter(u => u.role === 'Parceiro Indicador');
    return { sdrs, partners };
  }, [allUsers]);

  const leadTags = useMemo(() => allTags.filter(t => t.category === 'potencial' || t.category === 'area_atuacao'), [allTags]);


  useEffect(() => {
    if (isOpen && lead) {
      setName(lead.name);
      setEmail(lead.email);
      setPhone(lead.phone);
      setCompany(lead.company);
      setValue(String(lead.value));
      setResponsibleId(lead.responsibleId);
      setTags(lead.tags);
      setOrigin(lead.origin);
      setOriginPartnerId(lead.originPartnerId);
      setDescription(lead.description);
    } else {
      // Reset form for new lead
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setValue('');
      setResponsibleId(null);
      setTags([]);
      setOrigin('Indicação Parceiro');
      setOriginPartnerId(undefined);
      setDescription('');
    }
  }, [isOpen, lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const leadData = {
      name,
      email,
      phone,
      company,
      value: parseFloat(value) || 0,
      responsibleId,
      origin,
      originPartnerId: origin === 'Indicação Parceiro' ? originPartnerId : undefined,
      description,
      tags,
    };
    
    if (isEditing && lead) {
        await onSave({ ...lead, ...leadData });
    } else {
        await onSave(leadData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  const isSdrSelectDisabled = distributionMode === 'automatic' && !isEditing;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">{isEditing ? 'Editar Lead' : 'Adicionar Novo Lead'}</h2>
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
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300">Telefone</label>
                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-slate-300">Valor Estimado (R$)</label>
                <input type="number" id="value" value={value} onChange={e => setValue(e.target.value)} step="0.01" className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                 <label htmlFor="origin" className="block text-sm font-medium text-slate-300">Origem do Lead</label>
                <select id="origin" value={origin} onChange={e => setOrigin(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option>Indicação Parceiro</option>
                  <option>Google Ads</option>
                  <option>Site Orgânico</option>
                  <option>LinkedIn</option>
                  <option>Evento</option>
                  <option>Cold Call</option>
                  <option>Referência Cliente</option>
                </select>
              </div>
            </div>
            {origin === 'Indicação Parceiro' && (
                 <div>
                    <label htmlFor="partner" className="block text-sm font-medium text-slate-300">Parceiro Indicador</label>
                    <select id="partner" value={originPartnerId || ''} onChange={e => setOriginPartnerId(e.target.value || undefined)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                        <option value="">Selecione um parceiro</option>
                        {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            )}
             <div>
                <label htmlFor="responsible" className="block text-sm font-medium text-slate-300">Atribuir a SDR</label>
                <select id="responsible" value={responsibleId || ''} onChange={e => setResponsibleId(e.target.value || null)} disabled={isSdrSelectDisabled} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-slate-600/50 disabled:cursor-not-allowed">
                  <option value="">Não atribuído</option>
                  {sdrs.map(sdr => <option key={sdr.id} value={sdr.id}>{sdr.name}</option>)}
                </select>
                {distributionMode === 'automatic' && !isEditing && (
                    <p className="text-xs text-slate-400 mt-1">A atribuição é automática (Round-Robin).</p>
                )}
                 {isEditing && (
                    <p className="text-xs text-slate-400 mt-1">A atribuição não pode ser alterada aqui.</p>
                )}
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                <TagFilter 
                    selectedTags={tags} 
                    onTagFilterChange={setTags} 
                    allTags={leadTags}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">Descrição Detalhada do Caso</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isProcessing} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">{isProcessing ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};