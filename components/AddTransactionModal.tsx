import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, TransactionStatus } from '../types.ts';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTransaction: (transaction: Omit<Transaction, 'id' | 'reconciled'> & { id?: string }) => Promise<void>;
  transaction: Transaction | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSaveTransaction, transaction }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>('Receita');
  const [category, setCategory] = useState('Honorários Advocatícios');
  const [status, setStatus] = useState<TransactionStatus>('Previsto');

  useEffect(() => {
    if (transaction) {
        setDescription(transaction.description);
        setValue(String(transaction.value));
        setDate(transaction.date);
        setType(transaction.type);
        setCategory(transaction.category);
        setStatus(transaction.status);
    } else {
        // Reset form for new transaction
        setDescription('');
        setValue('');
        setDate(new Date().toISOString().split('T')[0]);
        setType('Receita');
        setCategory('Honorários Advocatícios');
        setStatus('Previsto');
    }
  }, [transaction, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveTransaction({
      id: transaction?.id,
      date,
      description,
      category,
      value: parseFloat(value),
      type,
      status,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-md border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6">{transaction ? 'Editar Transação' : 'Adicionar Nova Transação'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">Descrição</label>
              <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="value" className="block text-sm font-medium text-slate-300">Valor (R$)</label>
                <input type="number" id="value" value={value} onChange={e => setValue(e.target.value)} required step="0.01" className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-300">Data</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-300">Tipo</label>
                <select id="type" value={type} onChange={e => setType(e.target.value as TransactionType)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option>Receita</option>
                  <option>Despesa</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-300">Status</label>
                <select id="status" value={status} onChange={e => setStatus(e.target.value as TransactionStatus)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option>Previsto</option>
                  <option>Realizado</option>
                  <option>Cancelado</option>
                </select>
              </div>
            </div>
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300">Categoria</label>
                <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};