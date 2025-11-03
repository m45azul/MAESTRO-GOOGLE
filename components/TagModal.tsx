import React, { useState, useEffect } from 'react';
import { Tag } from '../types.ts';
import { tagCategoryLabels } from '../pages/ConfiguracoesPage.tsx';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagData: Omit<Tag, 'id'> | Tag) => Promise<void>;
  tag: Tag | null;
  isProcessing: boolean;
}

export const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, onSave, tag, isProcessing }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Tag['category']>('area_atuacao');
  const [color, setColor] = useState('#3b82f6');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  const isEditing = !!tag;

  useEffect(() => {
    if (isOpen) {
      if (tag) {
        setName(tag.name);
        setCategory(tag.category);
        setColor(tag.color);
        setDescription(tag.description || '');
        setIcon(tag.icon || '');
      } else {
        // Reset for new tag
        setName('');
        setCategory('area_atuacao');
        setColor('#3b82f6');
        setDescription('');
        setIcon('');
      }
    }
  }, [tag, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagData = {
      name,
      category,
      color,
      description,
      icon,
    };
    if (isEditing && tag) {
      await onSave({ ...tag, ...tagData });
    } else {
      // FIX: Add `isActive: true` to satisfy the Omit<Tag, 'id'> type for new tags.
      await onSave({ ...tagData, isActive: true });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">{isEditing ? 'Editar Tag' : 'Adicionar Nova Tag'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">Nome da Tag</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300">Categoria</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value as Tag['category'])} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  {Object.entries(tagCategoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-slate-300">Cor</label>
                <input type="color" id="color" value={color} onChange={e => setColor(e.target.value)} className="mt-1 w-full h-10 px-1 py-1 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-slate-300">Ícone (Opcional)</label>
                <input type="text" id="icon" value={icon} onChange={e => setIcon(e.target.value)} placeholder="Ex: FileText, Contract" className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">Descrição (Opcional)</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isProcessing} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {isProcessing ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};