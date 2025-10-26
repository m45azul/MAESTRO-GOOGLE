import React from 'react';
import type { Transaction, TransactionStatus, TransactionType } from '../types';
import { Card } from './Card';
import { ArrowUpRightIcon, ArrowDownLeftIcon, EditIcon, TrashIcon } from './icons';

interface TransactionTableProps {
  transactions: Transaction[];
  onToggleReconciled: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TypeIndicator: React.FC<{ type: TransactionType }> = ({ type }) => {
  if (type === 'Receita') {
    return <span title="Receita" className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400"><ArrowUpRightIcon className="w-4 h-4" /></span>;
  }
  return <span title="Despesa" className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400"><ArrowDownLeftIcon className="w-4 h-4" /></span>;
};

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const styles = {
        'Previsto': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        'Realizado': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Cancelado': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    return <span className={`text-xs font-bold px-2 py-1 rounded-full border ${styles[status]}`}>{status}</span>
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onToggleReconciled, onEdit, onDelete }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Últimas Transações</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800">
            <tr>
              <th scope="col" className="p-4"><span className="sr-only">Conciliado</span></th>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Descrição</th>
              <th scope="col" className="px-6 py-3">Categoria</th>
              <th scope="col" className="px-6 py-3 text-right">Valor</th>
              <th scope="col" className="px-6 py-3 text-center">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input 
                        id={`checkbox-${t.id}`} 
                        type="checkbox" 
                        checked={t.reconciled} 
                        onChange={() => onToggleReconciled(t.id)}
                        className="w-4 h-4 text-indigo-600 bg-slate-600 border-slate-500 rounded focus:ring-indigo-500" 
                        title="Conciliação manual"
                    />
                    <label htmlFor={`checkbox-${t.id}`} className="sr-only">checkbox</label>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td className="px-6 py-4 font-medium text-slate-200 flex items-center">
                    <TypeIndicator type={t.type} />
                    <span className="ml-3">{t.description}</span>
                </td>
                <td className="px-6 py-4">{t.category}</td>
                <td className={`px-6 py-4 font-semibold text-right ${t.type === 'Receita' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'Despesa' && '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                    <StatusBadge status={t.status} />
                </td>
                <td className="px-6 py-4 text-center">
                    <button onClick={() => onEdit(t)} className="text-slate-400 hover:text-indigo-400 mr-2"><EditIcon className="w-4 h-4"/></button>
                    <button onClick={() => onDelete(t.id)} className="text-slate-400 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};