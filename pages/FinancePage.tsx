import React, { useState, useMemo } from 'react';
import { KpiCard } from '../components/KpiCard';
import { TransactionTable } from '../components/TransactionTable';
import { AddTransactionModal } from '../components/AddTransactionModal';
import type { Transaction } from '../types';
import { PlusIcon } from '../components/icons';

interface FinancePageProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const FinancePage: React.FC<FinancePageProps> = ({ transactions, setTransactions }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const activeTransactions = useMemo(() => transactions.filter(t => !t.isDeleted), [transactions]);

    const financialOverview = useMemo(() => {
        const realized = activeTransactions.filter(t => t.status === 'Realizado');
        const revenue = realized.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.value, 0);
        const expense = realized.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.value, 0);
        return { revenue, expense, balance: revenue - expense };
    }, [activeTransactions]);
    
    const handleSaveTransaction = (transactionData: Omit<Transaction, 'id' | 'reconciled'> & { id?: string }) => {
        if(editingTransaction) { // Update
             setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...transactionData } : t));
        } else { // Create
            setTransactions(prev => [
                ...prev,
                { ...transactionData, id: `trans-${Date.now()}`, reconciled: false }
            ]);
        }
    };

    const handleDeleteTransaction = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
            setTransactions(prev => prev.map(t => t.id === id ? { ...t, isDeleted: true } : t));
        }
    };

    const openEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };
    
    const openAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleToggleReconciled = (id: string) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, reconciled: !t.reconciled } : t));
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Visão Geral Financeira</h2>
                 <button
                    onClick={openAddModal}
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    Adicionar Transação
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="Receitas (Realizadas no Mês)" value={`R$ ${financialOverview.revenue.toLocaleString('pt-BR')}`} change="+12.5%" />
                <KpiCard title="Despesas (Realizadas no Mês)" value={`R$ ${financialOverview.expense.toLocaleString('pt-BR')}`} change="+8.1%" isNegative />
                <KpiCard title="Saldo (Mês)" value={`R$ ${financialOverview.balance.toLocaleString('pt-BR')}`} change={financialOverview.balance > 0 ? '+21.3%' : '-5.0%'} isNegative={financialOverview.balance < 0} />
            </div>

            <div>
                <TransactionTable 
                    transactions={activeTransactions} 
                    onToggleReconciled={handleToggleReconciled}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTransaction}
                />
            </div>
            
            {isModalOpen && (
                <AddTransactionModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    onSaveTransaction={handleSaveTransaction}
                    transaction={editingTransaction}
                />
            )}
        </div>
    );
};