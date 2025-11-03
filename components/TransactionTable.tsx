import React from 'react';
import { Transaction, TransactionStatus, TransactionType } from '../types.ts';
import { Card } from './Card.tsx';
import { ArrowUpRightIcon, ArrowDownLeftIcon, EditIcon, TrashIcon, CheckCircleIcon } from './icons.tsx';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
}

const TypeIndicator: React.FC<{ type: TransactionType }> = ({ type }) => {
  if (type === 'Receita') {
    return <span title="Receita" className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400"><ArrowUpRightIcon className="w-4 h-4" /></span>;
  }
  return <span title="Despesa" className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400"><ArrowDownLeftIcon className="w-4 h-4" /></span>;
};

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const styles = {
        'Previsto': 'bg-sky-500/20 text-sky-400',
        'Realizado': 'bg-green-500/20 text-green-400',
        'Cancelado': 'bg-slate-500/20 text-slate-400',
    };
    return <span className={`text-xs font-bold px-2 py-1 rounded-full ${styles[status]}`}>{status}</span>
};

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit, onDelete }) => {
    
    const sortedTransactions = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                        <tr>
                            <th scope="col" className="p-4"></th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Descrição</th>
                            <th scope="col" className="px-6 py-3">Categoria</th>
                            <th scope="col" className="px-6 py-3 text-right">Valor</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Conciliado</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTransactions.map((t) => (
                            <tr key={t.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="p-4"><TypeIndicator type={t.type} /></td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                <td className="px-6 py-4 font-medium text-slate-200">{t.description}</td>
                                <td className="px-6 py-4">{t.category}</td>
                                <td className={`px-6 py-4 text-right font-semibold ${t.type === 'Receita' ? 'text-green-400' : 'text-red-400'}`}>
                                    {t.type === 'Despesa' && '- '}R$ {t.value.toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 text-center"><StatusBadge status={t.status} /></td>
                                <td className="px-6 py-4 text-center">
                                    {t.reconciled ? 
                                        // FIX: Wrapped CheckCircleIcon in a span to correctly apply the title attribute, resolving a type error.
                                        <span title="Conciliado">
                                            <CheckCircleIcon className="w-5 h-5 text-green-400 mx-auto" />
                                        </span> : 
                                        <div className="w-5 h-5 mx-auto flex items-center justify-center" title="Não conciliado">
                                            <div className="w-2.5 h-2.5 bg-slate-600 rounded-full"></div>
                                        </div>
                                    }
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center space-x-4">
                                        <button onClick={() => onEdit(t)} className="text-slate-400 hover:text-indigo-400" title="Editar"><EditIcon className="w-4 h-4"/></button>
                                        <button onClick={async () => await onDelete(t.id)} className="text-slate-400 hover:text-red-400" title="Excluir"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};