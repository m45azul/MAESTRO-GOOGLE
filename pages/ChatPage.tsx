import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card } from '../components/Card';
import { userMap } from '../data/users';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, ChatConversation, User } from '../types';
import { PlusIcon } from '../components/icons';
import { NewConversationModal } from '../components/NewConversationModal';

interface ChatPageProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  conversations: ChatConversation[];
  setConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
  allUsers: User[];
}

export const ChatPage: React.FC<ChatPageProps> = ({ messages, setMessages, conversations, setConversations, allUsers }) => {
    const { user } = useAuth();
    const [selectedConversationId, setSelectedConversationId] = useState('user-adv-1');
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const filteredConversations = useMemo(() => {
        return conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, conversations]);

    const handleSelectConversation = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        setConversations(prev => prev.map(c => 
            c.id === conversationId ? { ...c, unread: 0 } : c
        ));
    };

    const handleStartConversation = (targetUser: User) => {
        if (!user) return;
        
        const existingConversation = conversations.find(c => c.id === targetUser.id && c.type === 'user');

        if (existingConversation) {
            handleSelectConversation(existingConversation.id);
        } else {
            const newConversation: ChatConversation = {
                id: targetUser.id,
                name: targetUser.name,
                unread: 0,
                type: 'user',
            };
            setConversations(prev => [newConversation, ...prev]);
            setSelectedConversationId(newConversation.id);
        }
        setIsNewConversationModalOpen(false);
    };

    const selectedConversation = filteredConversations.find(c => c.id === selectedConversationId);

    const conversationMessages = useMemo(() => {
        if (!user || !selectedConversation) return [];
        
        if (selectedConversation.type === 'user') {
            return messages.filter(m => 
                (m.fromId === user.id && m.toId === selectedConversation.id) ||
                (m.fromId === selectedConversation.id && m.toId === user.id)
            );
        } else { // group chat
            return messages.filter(m => m.toId === selectedConversation.id);
        }
    }, [messages, selectedConversationId, user, selectedConversation]);


    useEffect(scrollToBottom, [conversationMessages]);
    
    const handleSendMessage = () => {
        if (message.trim() === '' || !user || !selectedConversation) return;

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            fromId: user.id,
            toId: selectedConversation.id,
            content: message,
            timestamp: new Date().toISOString(),
            read: true,
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    if(!user) return null;

    return (
        <>
            <div className="flex h-[calc(100vh-8rem)] gap-6">
                <Card className="w-1/3 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Conversas</h2>
                         <button 
                            onClick={() => setIsNewConversationModalOpen(true)} 
                            className="p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                            title="Nova Conversa"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar conversa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                        {filteredConversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => handleSelectConversation(conv.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedConversationId === conv.id ? 'bg-slate-700' : 'bg-slate-800/50 hover:bg-slate-700/50'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-slate-200">{conv.name}</p>
                                    {conv.unread > 0 && <span className="text-xs bg-indigo-600 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">{conv.unread}</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>
                <Card className="w-2/3 h-full flex flex-col">
                    <div className="border-b border-slate-700/50 pb-3 mb-4">
                        <h3 className="font-bold text-white">{selectedConversation?.name}</h3>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {conversationMessages.map(msg => {
                            const sender = userMap.get(msg.fromId);
                            const isMe = msg.fromId === user!.id;
                            return (
                                <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'justify-end' : ''}`}>
                                    {!isMe && sender && <img src={sender.avatarUrl} alt={sender.name} className="w-8 h-8 rounded-full flex-shrink-0"/>}
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${isMe ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                        {!isMe && sender && selectedConversation?.type === 'group' && <p className="text-xs font-bold mb-1 opacity-70">{sender.name}</p>}
                                        <p className="text-sm">{msg.content}</p>
                                        <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    {isMe && sender && <img src={sender.avatarUrl} alt={sender.name} className="w-8 h-8 rounded-full flex-shrink-0"/>}
                                </div>
                            )
                        }) }
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center">
                            <input 
                                type="text" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua mensagem..."
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                            <button onClick={handleSendMessage} className="ml-3 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={!message.trim()}>Enviar</button>
                        </div>
                    </div>
                </Card>
            </div>
            {isNewConversationModalOpen && (
                <NewConversationModal
                    isOpen={isNewConversationModalOpen}
                    onClose={() => setIsNewConversationModalOpen(false)}
                    onStartConversation={handleStartConversation}
                    allUsers={allUsers}
                    currentUser={user}
                />
            )}
        </>
    );
};
