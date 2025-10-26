import React, { useState } from 'react';
import { Card } from '../components/Card';
import { UserTable } from '../components/UserTable';
import { AddUserModal } from '../components/AddUserModal';
import { User } from '../types';
import { PlusIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';

interface EquipePageProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const EquipePage: React.FC<EquipePageProps> = ({ users, setUsers }) => {
    const { user: currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleSaveUser = (userData: Omit<User, 'id' | 'avatarUrl'> | User) => {
        if ('id' in userData) { // Editing
            setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } : u));
        } else { // Adding
            const newUser: User = {
                ...userData,
                id: `user-${Date.now()}`,
                avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
                status: 'Ativo',
            };
            setUsers(prev => [newUser, ...prev]);
        }
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleToggleStatus = (userId: string) => {
        const userToToggle = users.find(u => u.id === userId);
        if (!userToToggle) return;

        const action = userToToggle.status === 'Ativo' ? 'desativar' : 'reativar';
        if (window.confirm(`Tem certeza que deseja ${action} este usuário?`)) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } : u));
        }
    };

    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Gestão de Equipe</h1>
                {currentUser?.role === 'MAESTRO' && (
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Novo Usuário
                    </button>
                )}
            </div>
            <Card>
                <UserTable 
                    users={users}
                    onEdit={openEditModal}
                    onToggleStatus={handleToggleStatus}
                />
            </Card>
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