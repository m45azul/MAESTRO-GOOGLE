
import React, { useState, useMemo } from 'react';
import { KpiCard } from '../components/KpiCard.tsx';
import { TransactionTable } from '../components/TransactionTable.tsx';
import { AddTransactionModal } from '../components/AddTransactionModal.tsx';
import { BankReconciliation } from '../components/BankReconciliation.tsx';
import { Transaction } from '../types.ts';
import { PlusIcon } from '../components/icons.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

export const FinancePage: React.FC = () => {
    const { data, isLoading, saveTransaction, deleteTransaction, confirmReconciliation } = useApi();
    const { transactions = [] } = data || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState<'transactions' | 'reconciliation'>('transactions');

    const activeTransactions = useMemo(() => transactions.filter(t => !t.isDeleted), [transactions]);

    const financialOverview = useMemo(() => {
        const realized = activeTransactions.filter(t => t.status === 'Realizado');
        const revenue = realized.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.value, 0);
        const expense = realized.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.value, 0);
        return { revenue, expense, balance: revenue - expense };
    }, [activeTransactions]);
    
    const handleAction = async (action: Promise<any>) => {
        setIsProcessing(true);
        try {
            await action;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id' | 'reconciled'> & { id?: string }) => {
        await handleAction(saveTransaction(transactionData));
        setIsModalOpen(false);
    };

    const handleDeleteTransaction = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
            await handleAction(deleteTransaction(id));
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

    const TabButton: React.FC<{tabId: 'transactions' | 'reconciliation', label: string}> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tabId 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    if (isLoading) {
        return (
            <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <SkeletonLoader key={i} className="h-28" />)}
                </div>
                <SkeletonLoader className="h-96" />
            </div>
        );
    }


    return (
        <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="Receitas (Realizadas no Mês)" value={`R$ ${financialOverview.revenue.toLocaleString('pt-BR')}`} change="+12.5%" />
                <KpiCard title="Despesas (Realizadas no Mês)" value={`R$ ${financialOverview.expense.toLocaleString('pt-BR')}`} change="+8.1%" isNegative />
                <KpiCard title="Saldo (Mês)" value={`R$ ${financialOverview.balance.toLocaleString('pt-BR')}`} change={financialOverview.balance > 0 ? '+21.3%' : '-5.0%'} isNegative={financialOverview.balance < 0} />
            </div>

            <div className="border-b border-slate-700/50">
                <div className="-mb-px flex space-x-2">
                    <TabButton tabId="transactions" label="Gestão de Transações" />
                    <TabButton tabId="reconciliation" label="Conciliação Bancária com IA" />
                </div>
            </div>
            
            {activeTab === 'transactions' && (
                <div className="animate-fade-in">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={openAddModal}
                            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2"/>
                            Adicionar Transação
                        </button>
                    </div>
                    <div className="relative">
                        {isProcessing && (
                            <div className="absolute inset-0 bg-slate-900/50 z-20 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                            </div>
                        )}
                        <TransactionTable 
                            transactions={activeTransactions} 
                            onEdit={openEditModal}
                            onDelete={handleDeleteTransaction}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'reconciliation' && (
                 <div className="animate-fade-in">
                    <BankReconciliation 
                        transactions={activeTransactions} 
                        onConfirmReconciliation={(actions) => handleAction(confirmReconciliation(actions))}
                        onAddManualTransaction={openAddModal}
                    />
                 </div>
            )}
            
            {isModalOpen && (
                <AddTransactionModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    onSaveTransaction={handleSaveTransaction}
                    transaction={editingTransaction}
                />
            )}
             <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
