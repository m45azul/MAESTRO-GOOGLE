import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { EditIcon, UserCheckIcon, UserXIcon } from './icons';
import { useAuth } from '../context/AuthContext';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onToggleStatus: (userId: string) => void;
}

type SortKey = 'name' | 'email' | 'role' | 'status';

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onToggleStatus }) => {
    const { user: currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const sortedAndFilteredUsers = useMemo(() => {
        let result = [...users];

        if (searchTerm) {
            result = result.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.role.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        result.sort((a, b) => {
            const valA = a[sortKey] || '';
            const valB = b[sortKey] || '';
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [users, searchTerm, sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };
    
    const getStatusClasses = (status?: 'Ativo' | 'Inativo') => {
        return status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400';
    }

    return (
        <div>
             <input
                type="text"
                placeholder="Buscar por nome, email ou perfil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>Nome</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('role')}>Perfil</th>
                            <th scope="col" className="px-6 py-3">OAB</th>
                            <th scope="col" className="px-6 py-3 text-center cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-medium text-slate-200 flex items-center">
                                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                                    {user.name}
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">{user.oabNumber || 'N/A'}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusClasses(user.status)}`}>
                                        {user.status || 'Ativo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center space-x-4">
                                    {currentUser?.role === 'MAESTRO' && (
                                        <>
                                            <button onClick={() => onEdit(user)} className="text-slate-400 hover:text-indigo-400" title="Editar"><EditIcon className="w-4 h-4"/></button>
                                            {user.status === 'Ativo' ? (
                                                <button onClick={() => onToggleStatus(user.id)} className="text-slate-400 hover:text-red-400" title="Desativar"><UserXIcon className="w-4 h-4"/></button>
                                            ) : (
                                                <button onClick={() => onToggleStatus(user.id)} className="text-slate-400 hover:text-green-400" title="Reativar"><UserCheckIcon className="w-4 h-4"/></button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};