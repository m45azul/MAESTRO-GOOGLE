import React, { useState, useMemo } from 'react';
import { User } from '../types';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (user: User) => void;
  allUsers: User[];
  currentUser: User;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({ isOpen, onClose, onStartConversation, allUsers, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const availableUsers = useMemo(() => {
    return allUsers.filter(user => 
      user.id !== currentUser.id && 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, currentUser, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-md border border-slate-700 flex flex-col max-h-[70vh]">
        <h2 className="text-xl font-bold text-white mb-4">Iniciar Nova Conversa</h2>
        <input
            type="text"
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {availableUsers.map(user => (
                <button 
                    key={user.id}
                    onClick={() => onStartConversation(user)}
                    className="flex items-center w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left"
                >
                    <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full" />
                    <div className="ml-3">
                        <p className="font-semibold text-white text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.role}</p>
                    </div>
                </button>
            ))}
            {availableUsers.length === 0 && (
                <p className="text-center text-slate-500 py-4">Nenhum usuário encontrado.</p>
            )}
        </div>
        <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
};