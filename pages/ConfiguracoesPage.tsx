

import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card.tsx';
import { Tag, User } from '../types.ts';
import { PlusIcon, EditIcon, UserCheckIcon, UserXIcon, SaveIcon } from '../components/icons.tsx';
import { TagModal } from '../components/TagModal.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

export const tagCategoryLabels: Record<Tag['category'], string> = {
    area_atuacao: 'Área de Atuação',
    tipo_lead: 'Tipo de Lead',
    tipo_cliente: 'Tipo de Cliente',
    tipo_processo: 'Tipo de Processo',
    complexidade: 'Complexidade',
    prioridade: 'Prioridade',
    jurisdicao: 'Jurisdição',
    competencia: 'Competência',
    status: 'Status',
    origem: 'Origem',
    segmento: 'Segmento',
    fase_processo: 'Fase do Processo',
    instancia: 'Instância',
    natureza: 'Natureza',
    localizacao: 'Localização',
    tribunal: 'Tribunal',
    habilidade: 'Habilidade',
    nivel: 'Nível',
    urgencia: 'Urgência',
    impacto: 'Impacto',
    canal: 'Canal',
    potencial: 'Potencial',
    relacionamento: 'Relacionamento',
};

const ProfileCard: React.FC = () => {
    const { user: initialUser } = useAuth();
    const { saveUser } = useApi();
    
    // Local state for editing
    const [user, setUser] = useState<User | null>(initialUser);
    const [isEditing, setIsEditing] = useState(false);

    if (!user) return null;

    const handleSave = async () => {
        if (!user) return;
        await saveUser(user);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Meu Perfil</h2>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-indigo-400 hover:text-indigo-300">
                        <EditIcon className="w-4 h-4 mr-2" /> Editar
                    </button>
                ) : (
                    <button onClick={handleSave} className="flex items-center text-sm text-green-400 hover:text-green-300">
                        <SaveIcon className="w-4 h-4 mr-2" /> Salvar
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-slate-400">Nome</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange} disabled={!isEditing} className="w-full bg-transparent text-white p-1 border-b disabled:border-slate-700 border-indigo-500 focus:outline-none"/>
                </div>
                 <div>
                    <label className="text-xs text-slate-400">Email</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} disabled={!isEditing} className="w-full bg-transparent text-white p-1 border-b disabled:border-slate-700 border-indigo-500 focus:outline-none"/>
                </div>
                 <div>
                    <label className="text-xs text-slate-400">Telefone</label>
                    <input type="text" name="phone" value={user.phone || ''} onChange={handleChange} disabled={!isEditing} className="w-full bg-transparent text-white p-1 border-b disabled:border-slate-700 border-indigo-500 focus:outline-none"/>
                </div>
                 <div>
                    <label className="text-xs text-slate-400">Perfil de Acesso</label>
                    <p className="text-white p-1">{user.role}</p>
                </div>
            </div>
        </Card>
    );
};

export const ConfiguracoesPage: React.FC = () => {
    const { data, isLoading, saveTag, toggleTagStatus } = useApi();
    const { tags = [] } = data || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const groupedTags = useMemo(() => {
        return (tags || []).reduce((acc, tag) => {
            const category = tag.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(tag);
            return acc;
        }, {} as Record<string, Tag[]>);
    }, [tags]);
    
    const handleAction = async (action: Promise<any>) => {
        setIsProcessing(true);
        try {
            await action;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSave = async (tagData: Omit<Tag, 'id'> | Tag) => {
        await handleAction(saveTag(tagData));
        setIsModalOpen(false);
    };

    const handleToggleStatus = async (tagId: string) => {
        await handleAction(toggleTagStatus(tagId));
    };

    const openAddModal = () => {
        setEditingTag(null);
        setIsModalOpen(true);
    };

    const openEditModal = (tag: Tag) => {
        setEditingTag(tag);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="space-y-8">
                <ProfileCard />

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Gerenciamento de Tags</h1>
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Adicionar Tag
                    </button>
                </div>
                
                {isLoading ? (
                    <SkeletonLoader className="h-64" />
                ) : (
                    (Object.entries(groupedTags) as [Tag['category'], Tag[]][]).map(([category, tagsInCategory]) => (
                        <Card key={category}>
                            <h2 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">{tagCategoryLabels[category] || category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tagsInCategory.map(tag => (
                                    <div key={tag.id} className={`p-4 rounded-lg bg-slate-800/50 border border-slate-700 relative group ${isProcessing ? 'opacity-50' : ''}`}>
                                        <div className="flex items-center mb-2">
                                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }}></span>
                                            <p className="font-bold text-slate-200">{tag.name}</p>
                                        </div>
                                        <p className="text-xs text-slate-400 h-8 overflow-hidden">{tag.description || 'Sem descrição.'}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${tag.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                {tag.isActive ? 'Ativa' : 'Inativa'}
                                            </span>
                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal(tag)} className="text-slate-400 hover:text-indigo-400" title="Editar Tag">
                                                    <EditIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={async () => await handleToggleStatus(tag.id)} className={`text-slate-400 ${tag.isActive ? 'hover:text-red-400' : 'hover:text-green-400'}`} title={tag.isActive ? 'Desativar' : 'Ativar'}>
                                                    {tag.isActive ? <UserXIcon className="w-4 h-4" /> : <UserCheckIcon className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {isModalOpen && (
                <TagModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    tag={editingTag}
                    isProcessing={isProcessing}
                />
            )}
        </>
    );
};