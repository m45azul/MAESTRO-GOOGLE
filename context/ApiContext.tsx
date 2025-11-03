
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { AppData, Lead, LegalCase, Client, Transaction, Contract, Appointment, MuralPost, ChatMessage, Task, Note, TimeLog, Tag, Document, User, ChatConversation } from '../types.ts';
import { apiService } from '../services/apiService.tsx';
import { workflowService } from '../services/workflowService.tsx';
import { useNotification } from './NotificationContext.tsx';

interface ApiContextType {
    data: AppData | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    
    // Mutations
    addLead: (leadData: Omit<Lead, 'id' | 'stage'>) => Promise<void>;
    updateLead: (updatedLead: Lead) => Promise<void>;
    deleteLead: (leadId: string) => Promise<void>;
    convertLead: (lead: Lead, createCase: boolean, caseTitle: string, responsibleId: string) => Promise<void>;
    saveCase: (caseData: Omit<LegalCase, 'id'> & { id?: string }) => Promise<void>;
    archiveCase: (caseId: string) => Promise<void>;
    addCaseUpdate: (caseId: string, authorId: string, description: string) => Promise<void>;
    addTimeLog: (caseId: string, timeLogData: Omit<TimeLog, 'id' | 'status'>) => Promise<void>;
    updateTimeLogStatus: (caseId: string, timeLogId: string, status: TimeLog['status']) => Promise<void>;
    syncCaseWithCourt: (caseId: string) => Promise<void>;
    uploadDocument: (caseId: string, file: File) => Promise<void>;
    analyzeDocument: (caseId: string, documentId: string) => Promise<void>;
    addClientNote: (clientId: string, authorId: string, content: string) => Promise<void>;
    editClientNote: (clientId: string, noteId: string, content: string) => Promise<void>;
    deleteClientNote: (clientId: string, noteId: string) => Promise<void>;
    saveTransaction: (transactionData: Omit<Transaction, 'id' | 'reconciled'> & { id?: string }) => Promise<void>;
    deleteTransaction: (transactionId: string) => Promise<void>;
    confirmReconciliation: (actions: Array<{ type: 'match', transactionId: string } | { type: 'create', transactionData: Omit<Transaction, 'id' | 'reconciled'> }>) => Promise<void>;
    saveUser: (userData: Omit<User, 'id' | 'avatarUrl'> | User) => Promise<void>;
    toggleUserStatus: (userId: string) => Promise<void>;
    saveTag: (tagData: Omit<Tag, 'id'> | Tag) => Promise<void>;
    toggleTagStatus: (tagId: string) => Promise<void>;
    addMuralPost: (authorId: string, content: string) => Promise<void>;
    likeMuralPost: (postId: string, userId: string) => Promise<void>;
    addMuralComment: (postId: string, authorId: string, content: string) => Promise<void>;
    addChatMessage: (fromId: string, toId: string, content: string) => Promise<void>;
    saveAppointment: (appointmentData: Omit<Appointment, 'id'> | Appointment) => Promise<void>;
    deleteAppointment: (appointmentId: string) => Promise<void>;
    setConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { addNotification } = useNotification();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const allData = await apiService.getAllData();
            setData(allData);
            setError(null);
        } catch (e: any) {
            setError(e);
            addNotification('Falha ao carregar os dados da aplicação.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createMutation = <T extends any[], R>(
        apiCall: (...args: T) => Promise<R>,
        successMessage: string,
        optimisticUpdate?: (...args: T) => () => void
    ) => async (...args: T) => {
        let rollback: (() => void) | undefined;
        if (optimisticUpdate) {
            rollback = optimisticUpdate(...args);
        }
        try {
            await apiCall(...args);
            if (!optimisticUpdate) await fetchData();
            if (successMessage) addNotification(successMessage, 'success');
        } catch (e: any) {
            addNotification(`Erro: ${e.message || 'Ocorreu um erro.'}`, 'error');
            if (rollback) rollback(); // Rollback on failure
            if (!optimisticUpdate) await fetchData(); // Refetch to get correct state
        }
    };

    const mutations = {
        addLead: createMutation(apiService.addLead, 'Lead adicionado com sucesso.'),
        updateLead: createMutation(apiService.updateLead, 'Lead atualizado com sucesso.'),
        deleteLead: createMutation(apiService.deleteLead, 'Lead removido com sucesso.'),
        saveCase: createMutation(apiService.saveCase, 'Processo salvo com sucesso.'),
        archiveCase: createMutation(
            (caseId: string) => apiService.updateCaseStatus(caseId, 'Arquivado'), 
            'Processo arquivado com sucesso.'
        ),
        addCaseUpdate: createMutation(apiService.addCaseUpdate, 'Andamento adicionado.'),
        addTimeLog: createMutation(apiService.addTimeLog, 'Horas lançadas com sucesso.'),
        updateTimeLogStatus: createMutation(apiService.updateTimeLogStatus, 'Status do lançamento atualizado.'),
        syncCaseWithCourt: createMutation(apiService.syncCaseWithCourt, 'Sincronização com tribunal iniciada.'),
        uploadDocument: createMutation(apiService.uploadDocument, 'Documento enviado com sucesso.'),
        analyzeDocument: createMutation(
            async (caseId: string, documentId: string) => {
                // Special handling for multi-step async process
                setData(prev => {
                    if (!prev) return null;
                    const cases = prev.cases.map(c => {
                        if (c.id === caseId) {
                            return { ...c, documents: c.documents.map(d => d.id === documentId ? { ...d, analysisStatus: 'pending' as const } : d)};
                        }
                        return c;
                    });
                    return { ...prev, cases };
                });
                await apiService.analyzeDocument(caseId, documentId);
            }, 
            'Análise do documento concluída.'
        ),
        addClientNote: createMutation(apiService.addClientNote, 'Anotação adicionada.'),
        editClientNote: createMutation(apiService.updateClientNote, 'Anotação atualizada.'),
        deleteClientNote: createMutation(apiService.deleteClientNote, 'Anotação removida.'),
        saveTransaction: createMutation(apiService.saveTransaction, 'Transação salva.'),
        deleteTransaction: createMutation(apiService.deleteTransaction, 'Transação removida.'),
        confirmReconciliation: createMutation(
            async (actions: any[]) => {
                const matches = actions.filter(a => a.type === 'match').map(a => a.transactionId);
                if (matches.length > 0) await apiService.confirmReconciliation(matches);
                const creations = actions.filter(a => a.type === 'create').map(a => a.transactionData);
                for (const trans of creations) {
                    await apiService.saveTransaction(trans);
                }
            }, 'Conciliação confirmada.'
        ),
        saveUser: createMutation(apiService.saveUser, 'Usuário salvo com sucesso.'),
        toggleUserStatus: createMutation(apiService.toggleUserStatus, 'Status do usuário alterado.'),
        saveTag: createMutation(apiService.saveTag, 'Tag salva com sucesso.'),
        toggleTagStatus: createMutation(apiService.toggleTagStatus, 'Status da tag alterado.'),
        addMuralPost: createMutation(apiService.addMuralPost, 'Post publicado no mural.'),
        addMuralComment: createMutation(apiService.addMuralComment, 'Comentário adicionado.'),
        addChatMessage: createMutation(apiService.addChatMessage, ''), // No notification for chat
        saveAppointment: createMutation(apiService.saveAppointment, 'Compromisso salvo.'),
        deleteAppointment: createMutation(apiService.deleteAppointment, 'Compromisso excluído.'),
        convertLead: createMutation(
            (lead: Lead, createCase: boolean, caseTitle: string, responsibleId: string) => 
                workflowService.trigger('CONVERT_LEAD', { lead, createCase, caseTitle, responsibleId }),
            'Lead convertido em cliente com sucesso!'
        ),
        likeMuralPost: async (postId: string, userId: string) => {
            const originalData = JSON.stringify(data); // Deep copy for rollback
            // Optimistic Update
            setData(prev => {
                if (!prev) return null;
                const newPosts = prev.muralPosts.map(p => {
                    if (p.id === postId) {
                        const hasLiked = p.likes.includes(userId);
                        const newLikes = hasLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId];
                        return { ...p, likes: newLikes };
                    }
                    return p;
                });
                return { ...prev, muralPosts: newPosts };
            });

            try {
                await apiService.likeMuralPost(postId, userId);
                // No success notification for a simple like
            } catch (e: any) {
                addNotification(`Erro ao curtir post: ${e.message}`, 'error');
                setData(JSON.parse(originalData)); // Rollback
            }
        },
        setConversations: (updater) => {
            setData(prevData => {
                if (!prevData) return null;
                
                const currentConversations = prevData.chatConversations;
                
                // Check if the updater is a function or a value
                const newConversations = typeof updater === 'function'
                    ? (updater as (prevState: ChatConversation[]) => ChatConversation[])(currentConversations)
                    : updater;
                    
                return { ...prevData, chatConversations: newConversations };
            });
        },
    };

    const value = {
        data,
        isLoading,
        error,
        refetch: fetchData,
        ...mutations
    };

    return (
        <ApiContext.Provider value={value as ApiContextType}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};
