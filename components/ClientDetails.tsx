import React, { useState } from 'react';
import { Card } from './Card.tsx';
import { Client, LegalCase, Note } from '../types.ts';
import { EditIcon, TrashIcon, SaveIcon, XIcon } from './icons.tsx';
import { userMap } from '../data/allData.ts';
import { useAuth } from '../context/AuthContext.tsx';

// --- ClientNotes Sub-Component ---
interface ClientNotesProps {
    client: Client;
    onAddNote: (clientId: string, content: string) => Promise<void>;
    onEditNote: (clientId: string, noteId: string, content: string) => Promise<void>;
    onDeleteNote: (clientId: string, noteId: string) => Promise<void>;
}

const ClientNotes: React.FC<ClientNotesProps> = ({ client, onAddNote, onEditNote, onDeleteNote }) => {
    const { user: currentUser } = useAuth();
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');

    if (!currentUser) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newNote.trim()) {
            await onAddNote(client.id, newNote);
            setNewNote('');
        }
    };

    const handleEditClick = (note: Note) => {
        setEditingNoteId(note.id);
        setEditingContent(note.content);
    };

    const handleSaveEdit = async (noteId: string) => {
        if (editingContent.trim()) {
            await onEditNote(client.id, noteId, editingContent);
        }
        setEditingNoteId(null);
        setEditingContent('');
    };

    const handleDeleteClick = async (noteId: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta anotação?")) {
            await onDeleteNote(client.id, noteId);
        }
    };

    return (
        <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-3">Anotações Internas</h4>
            <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Adicionar uma nova anotação..."
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button type="submit" disabled={!newNote.trim()} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm">
                    Adicionar
                </button>
            </form>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {(client.notes || []).slice().reverse().map(note => {
                    const author = userMap.get(note.authorId);
                    return (
                        <div key={note.id} className="p-3 bg-slate-800/50 rounded-lg group">
                            {editingNoteId === note.id ? (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-sm w-full"
                                    />
                                    <button onClick={() => handleSaveEdit(note.id)} className="text-green-400 hover:text-green-300 p-1"><SaveIcon className="w-4 h-4" /></button>
                                    <button onClick={() => setEditingNoteId(null)} className="text-slate-400 hover:text-white p-1"><XIcon className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-slate-300">{note.content}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-slate-500">
                                            - {author?.name || 'Desconhecido'} em {new Date(note.timestamp).toLocaleDateString('pt-BR')}
                                        </p>
                                        {currentUser.id === note.authorId && (
                                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditClick(note)} className="text-slate-400 hover:text-indigo-400 p-1"><EditIcon className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteClick(note.id)} className="text-slate-400 hover:text-red-400 p-1"><TrashIcon className="w-4 h-4" /></button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// --- Main ClientDetails Component ---
interface ClientDetailsProps {
    client?: Client;
    cases: LegalCase[];
    onEdit: () => void;
    onDeactivate: (clientId: string) => void;
    onAddNote: (clientId: string, content: string) => Promise<void>;
    onEditNote: (clientId: string, noteId: string, content: string) => Promise<void>;
    onDeleteNote: (clientId: string, noteId: string) => Promise<void>;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ client, cases, onEdit, onDeactivate, onAddNote, onEditNote, onDeleteNote }) => {

    if (!client) {
        return <Card className="h-full flex items-center justify-center text-slate-500">Selecione um cliente para ver os detalhes</Card>;
    }

    return (
        <Card className="h-full flex flex-col">
            <div className="flex-shrink-0 border-b border-slate-700/50 pb-4 mb-4">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-white pr-8">{client.name}</h2>
                    <div className="flex items-center space-x-4">
                        <button onClick={onEdit} className="flex items-center text-sm text-indigo-400 hover:text-indigo-300">
                            <EditIcon className="w-4 h-4 mr-2" /> Editar
                        </button>
                        <button onClick={() => onDeactivate(client.id)} className="flex items-center text-sm text-red-400 hover:text-red-300">
                            <TrashIcon className="w-4 h-4 mr-2" /> Desativar
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm text-slate-400 mt-3">
                    <div><span className="font-semibold text-slate-300">Tipo:</span> {client.type}</div>
                    <div><span className="font-semibold text-slate-300">CPF/CNPJ:</span> {client.cpfCnpj}</div>
                    <div><span className="font-semibold text-slate-300">Email:</span> {client.email}</div>
                    <div><span className="font-semibold text-slate-300">Telefone:</span> {client.phone}</div>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2">
                {/* Cases Section */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Processos Vinculados</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cases.length > 0 ? cases.map(c => (
                            <div key={c.id} className="p-3 bg-slate-800/50 rounded-lg">
                                <p className="font-medium text-slate-200 text-sm">{c.title}</p>
                                <p className="text-xs text-slate-400 mt-1">{c.processNumber} - <span className="font-semibold">{c.status}</span></p>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500">Nenhum processo vinculado a este cliente.</p>
                        )}
                    </div>
                </div>

                {/* Notes Section */}
                <ClientNotes
                    client={client}
                    onAddNote={onAddNote}
                    onEditNote={onEditNote}
                    onDeleteNote={onDeleteNote}
                />
            </div>
        </Card>
    );
};