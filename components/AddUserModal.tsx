import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'avatarUrl'> | User) => Promise<void>;
  user: User | null;
}

const ROLES: UserRole[] = [
  'MAESTRO', 'Sócio', 'Controller', 'Advogado Interno', 'Advogado Parceiro', 
  'SDR', 'Administrativo', 'Operador de Atendimento', 'Parceiro Indicador', 
  'Parceiro SDR', 'Parceiro Outros'
];

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Advogado Interno');
  const [oabNumber, setOabNumber] = useState('');
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  
  const isEditing = !!user;

  useEffect(() => {
    if (isOpen && user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setOabNumber(user.oabNumber || '');
        setStatus(user.status || 'Ativo');
        setCpf(user.cpf || '');
        setPhone(user.phone || '');
    } else {
        setName('');
        setEmail('');
        setRole('Advogado Interno');
        setOabNumber('');
        setStatus('Ativo');
        setCpf('');
        setPhone('');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseData = { name, email, role, status, oabNumber, cpf, phone };
    
    if (isEditing && user) {
      await onSave({ ...user, ...baseData });
    } else {
      await onSave(baseData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">Nome Completo</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-slate-300">CPF</label>
                    <input type="text" id="cpf" value={cpf} onChange={e => setCpf(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300">Telefone</label>
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300">Perfil</label>
                <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-300">Status</label>
                <select id="status" value={status} onChange={e => setStatus(e.target.value as 'Ativo' | 'Inativo')} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
             <div>
                <label htmlFor="oabNumber" className="block text-sm font-medium text-slate-300">Número da OAB (se aplicável)</label>
                <input type="text" id="oabNumber" value={oabNumber} onChange={e => setOabNumber(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};