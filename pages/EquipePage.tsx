
import React, { useState } from 'react';
import { Card } from '../components/Card.tsx';
import { UserTable } from '../components/UserTable.tsx';
import { AddUserModal } from '../components/AddUserModal.tsx';
import { User } from '../types.ts';
import { PlusIcon } from '../components/icons.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

export const EquipePage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const { data, isLoading, saveUser, toggleUserStatus } = useApi();
    const { users = [] } = data || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleAction = async (action: Promise<any>) => {
        setIsProcessing(true);
        try {
            await action;
        } finally {
            setIsProcessing(false);
        }
    };


    const handleSaveUser = async (userData: Omit<User, 'id' | 'avatarUrl'> | User) => {
        await handleAction(saveUser(userData));
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleToggleStatus = async (userId: string) => {
        const userToToggle = users.find(u => u.id === userId);
        if (!userToToggle) return;

        const action = userToToggle.status === 'Ativo' ? 'desativar' : 'reativar';
        if (window.confirm(`Tem certeza que deseja ${action} este usuário?`)) {
            await handleAction(toggleUserStatus(userId));
        }
    };

    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (userToEdit: User) => {
        setEditingUser(userToEdit);
        setIsModalOpen(true);
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <SkeletonLoader className="h-96" />;
        }
        
        return (
            <Card>
                {isProcessing && (
                    <div className="absolute inset-0 bg-slate-800/50 z-20 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                    </div>
                )}
                <UserTable 
                    users={users} 
                    onEdit={openEditModal} 
                    onToggleStatus={handleToggleStatus} 
                />
            </Card>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Gerenciamento da Equipe</h1>
                {currentUser?.role === 'MAESTRO' && (
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Adicionar Usuário
                    </button>
                )}
            </div>
            {renderContent()}

            {isModalOpen && (
                <AddUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveUser}
                    user={editingUser}
                />
            )}
        </>
    );
};
