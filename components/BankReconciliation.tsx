import React, { useState } from 'react';
import { getAIReconciliation } from '../services/geminiService.ts';
import { Transaction, BankStatementItem, AIReconciliationResult } from '../types.ts';
import { UploadCloudIcon, CheckCircleIcon, XCircleIcon, PlusCircleIcon, PlusIcon } from './icons.tsx';
import { Card } from './Card.tsx';

// Mock data simulating a bank statement upload
const mockBankStatement: BankStatementItem[] = [
    { id: 'stmt-1', date: '2025-10-25', description: 'HONORARIOS ADV PROC 001', value: 15000.00, type: 'credit' },
    { id: 'stmt-2', date: '2025-10-20', description: 'TED RECEBIDO CLIENTE Y', value: 5000.00, type: 'credit' },
    { id: 'stmt-3', date: '2025-10-22', description: 'PAGTO ENERGIA ELETRICA', value: 350.00, type: 'debit' },
    { id: 'stmt-4', date: '2025-10-23', description: 'COMPRA ONLINE - AMAZON', value: 125.90, type: 'debit' },
];


interface BankReconciliationProps {
    transactions: Transaction[];
    onConfirmReconciliation: (actions: Array<{ type: 'match', transactionId: string } | { type: 'create', transactionData: Omit<Transaction, 'id' | 'reconciled'> }>) => Promise<void>;
    onAddManualTransaction: () => void;
}

type Step = 'upload' | 'analyzing' | 'review';

type UserAction = { statementItemId: string; type: 'match'; transactionId: string } | { statementItemId: string; type: 'create' } | { statementItemId: string; type: 'ignore' };


export const BankReconciliation: React.FC<BankReconciliationProps> = ({ transactions, onConfirmReconciliation, onAddManualTransaction }) => {
    const [step, setStep] = useState<Step>('upload');
    const [isLoading, setIsLoading] = useState(false);
    const [aiResult, setAiResult] = useState<AIReconciliationResult | null>(null);
    const [userActions, setUserActions] = useState<UserAction[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleStartReconciliation = async () => {
        setIsLoading(true);
        setStep('analyzing');
        setError(null);
        try {
            const result = await getAIReconciliation(mockBankStatement, transactions);
            setAiResult(result);
            setStep('review');
        } catch (e) {
            console.error("Reconciliation failed", e);
            setError("Falha ao analisar o extrato com a IA. Tente novamente.");
            setStep('upload');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUserAction = (action: UserAction) => {
        setUserActions(prev => {
            // Remove any previous action for the same statement item
            const filtered = prev.filter(a => a.statementItemId !== action.statementItemId);
            return [...filtered, action];
        });
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        const finalActions = userActions
            .filter(a => a.type !== 'ignore')
            .map(a => {
                if (a.type === 'match') {
                    return { type: 'match', transactionId: a.transactionId };
                }
                // For 'create', find the statement item to get necessary data
                const statementItem = mockBankStatement.find(s => s.id === a.statementItemId);
                if (!statementItem) return null;
                return {
                    type: 'create',
                    transactionData: {
                        date: statementItem.date,
                        description: `Conciliado: ${statementItem.description}`,
                        category: 'A classificar',
                        value: statementItem.value,
                        type: statementItem.type === 'credit' ? 'Receita' : 'Despesa',
                        status: 'Realizado' as const,
                    }
                };
            }).filter(Boolean);

        await onConfirmReconciliation(finalActions as any[]);
        setIsLoading(false);
        setStep('upload');
        setAiResult(null);
        setUserActions([]);
    };
    
    const getActionForStatementItem = (statementItemId: string) => {
        return userActions.find(a => a.statementItemId === statementItemId);
    }
    
    // --- Render Functions ---

    const renderUploadStep = () => (
        <Card className="text-center p-8">
            <h3 className="text-lg font-semibold text-white">Conciliação Bancária Inteligente</h3>
            <p className="text-sm text-slate-400 mt-2 mb-6">Importe seu extrato bancário (formato OFX ou CSV) e deixe a IA da Maestro fazer o trabalho pesado.</p>
            <button
                onClick={handleStartReconciliation}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
                <UploadCloudIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Analisando...' : 'Iniciar Análise (Usar Extrato Simulado)'}
            </button>
             {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </Card>
    );
    
    const renderAnalyzingStep = () => (
        <Card className="text-center p-8">
            <div className="flex justify-center items-center mb-4">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
            </div>
            <h3 className="text-lg font-semibold text-white">Analisando Extrato...</h3>
            <p className="text-sm text-slate-400 mt-2">Aguarde enquanto a IA da Maestro compara os lançamentos com suas transações.</p>
        </Card>
    );

    const renderReviewStep = () => {
        if (!aiResult) return null;
        
        return (
             <div className="space-y-6">
                <Card>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div><p className="text-2xl font-bold">{aiResult.summary.totalLines}</p><p className="text-xs text-slate-400">Linhas no Extrato</p></div>
                        <div><p className="text-2xl font-bold text-green-400">{aiResult.summary.automaticMatches}</p><p className="text-xs text-slate-400">Conciliadas Automaticamente</p></div>
                        <div><p className="text-2xl font-bold text-amber-400">{aiResult.summary.suggestions}</p><p className="text-xs text-slate-400">Sugestões da IA</p></div>
                        <div><p className="text-2xl font-bold text-red-400">{aiResult.summary.unmatched}</p><p className="text-xs text-slate-400">Não Conciliadas</p></div>
                    </div>
                </Card>
                
                {/* Suggestions */}
                {aiResult.suggestions.length > 0 && (
                    <Card>
                        <h4 className="text-lg font-semibold text-white mb-4">Sugestões da IA</h4>
                        <div className="space-y-4">
                            {aiResult.suggestions.map(({ statementItem, suggestedTransactions }) => {
                                const action = getActionForStatementItem(statementItem.id);
                                return (
                                <div key={statementItem.id} className="p-4 bg-slate-800/50 rounded-lg">
                                    <p className="font-semibold text-slate-200">{statementItem.description} - R$ {statementItem.value.toLocaleString('pt-br')}</p>
                                    <div className="mt-2 pl-4 border-l-2 border-slate-600 space-y-2">
                                        {suggestedTransactions.map(({ transaction, confidenceScore, reason }) => (
                                            <div key={transaction.id} className="flex justify-between items-center p-2 rounded-md bg-slate-700/50">
                                                <div>
                                                    <p className="text-sm">{transaction.description} - R$ {transaction.value.toLocaleString('pt-br')}</p>
                                                    <p className="text-xs text-amber-300">Confiança: {confidenceScore}% ({reason})</p>
                                                </div>
                                                <button onClick={() => handleUserAction({ statementItemId: statementItem.id, type: 'match', transactionId: transaction.id })}
                                                    className={`px-3 py-1 text-xs rounded ${action?.type === 'match' && action.transactionId === transaction.id ? 'bg-green-600' : 'bg-slate-600 hover:bg-green-700'}`}>
                                                    {action?.type === 'match' && action.transactionId === transaction.id ? 'Selecionado' : 'Conciliar'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )})}
                        </div>
                    </Card>
                )}

                {/* Unmatched */}
                {aiResult.unmatchedItems.length > 0 && (
                     <Card>
                        <h4 className="text-lg font-semibold text-white mb-4">Itens Não Conciliados</h4>
                        <div className="space-y-3">
                           {aiResult.unmatchedItems.map(({ statementItem, reason }) => {
                               const action = getActionForStatementItem(statementItem.id);
                               return (
                               <div key={statementItem.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <div>
                                       <p className="font-medium text-slate-300">{statementItem.description}</p>
                                       <p className="text-sm font-bold text-red-400">R$ {statementItem.value.toLocaleString('pt-br')}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleUserAction({ statementItemId: statementItem.id, type: 'create'})} className={`flex items-center text-xs px-2 py-1 rounded ${action?.type === 'create' ? 'bg-blue-600' : 'bg-slate-600 hover:bg-blue-700'}`}><PlusCircleIcon className="w-4 h-4 mr-1"/> Criar Transação</button>
                                        <button onClick={() => handleUserAction({ statementItemId: statementItem.id, type: 'ignore'})} className={`flex items-center text-xs px-2 py-1 rounded ${action?.type === 'ignore' ? 'bg-slate-500' : 'bg-slate-600 hover:bg-slate-700'}`}><XCircleIcon className="w-4 h-4 mr-1"/> Ignorar</button>
                                    </div>
                               </div>
                           )})}
                        </div>
                    </Card>
                )}

                 <div className="flex justify-between items-center mt-6">
                    <button onClick={onAddManualTransaction} className="flex items-center px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2"/>
                        Adicionar Manualmente
                    </button>
                    <button onClick={handleConfirm} disabled={isLoading} className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                        <CheckCircleIcon className="w-5 h-5 mr-2"/>
                        {isLoading ? 'Confirmando...' : 'Confirmar Conciliação'}
                    </button>
                </div>

            </div>
        );
    };

    switch(step) {
        case 'upload': return renderUploadStep();
        case 'analyzing': return renderAnalyzingStep();
        case 'review': return renderReviewStep();
        default: return null;
    }
};