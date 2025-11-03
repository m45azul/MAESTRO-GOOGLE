
import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card.tsx';
import { HeadphonesIcon, SendIcon } from '../components/icons.tsx';
import { SupportConversation, SupportMessage, User } from '../types.ts';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

export const AtendimentoPage: React.FC = () => {
    const { data, isLoading } = useApi();
    const { supportConversations: conversations = [], supportMessages: messages = [], users = [] } = data || {};

    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversations[0]?.id || null);
    const [newMessage, setNewMessage] = useState('');
    const agentMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
    
    // Effect to set initial selected conversation
    React.useEffect(() => {
        if (!selectedConversationId && conversations.length > 0) {
            setSelectedConversationId(conversations[0].id);
        }
    }, [conversations, selectedConversationId]);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    const conversationMessages = useMemo(() => {
        return messages
            .filter(m => m.conversationId === selectedConversationId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, selectedConversationId]);
    
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversationId) return;
        // In a real app, this would call an API service to send the message
        alert(`Mensagem enviada para ${selectedConversation?.clientName}: ${newMessage}`);
        setNewMessage('');
    }

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] gap-6">
                <SkeletonLoader className="w-1/3 h-full" />
                <SkeletonLoader className="w-2/3 h-full" />
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            <Card className="w-1/3 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <HeadphonesIcon className="w-6 h-6 mr-3 text-indigo-400" />
                        Caixa de Entrada
                    </h2>
                </div>
                 <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                    {conversations.length > 0 ? conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConversationId(conv.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedConversationId === conv.id ? 'bg-slate-700' : 'bg-slate-800/50 hover:bg-slate-700/50'}`}
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-slate-200 truncate">{conv.clientName}</p>
                                {conv.unreadCount > 0 && <span className="text-xs bg-indigo-600 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">{conv.unreadCount}</span>}
                            </div>
                             <p className="text-xs text-slate-400 mt-1 truncate">{conv.lastMessage}</p>
                             <div className="text-xs text-slate-500 mt-2 flex justify-between">
                                <span>{conv.channel}</span>
                                <span className={`${conv.status === 'open' ? 'text-green-400' : 'text-slate-400'}`}>{conv.status}</span>
                             </div>
                        </button>
                    )) : (
                        <p className="text-center text-slate-500 py-8">Nenhuma conversa na caixa de entrada.</p>
                    )}
                </div>
            </Card>
            <Card className="w-2/3 h-full flex flex-col">
                {selectedConversation ? (
                    <>
                        <div className="border-b border-slate-700/50 pb-3 mb-4">
                            <h3 className="font-bold text-white">{selectedConversation.clientName}</h3>
                            <p className="text-sm text-slate-400">{selectedConversation.clientContact}</p>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                             {conversationMessages.map(msg => {
                                const isAgent = msg.sender === 'agent' || msg.sender === 'bot';
                                const agent = msg.agentId ? agentMap.get(msg.agentId) : null;
                                return (
                                    <div key={msg.id} className={`flex items-end gap-3 ${isAgent ? 'justify-end' : ''}`}>
                                        {!isAgent && <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center font-bold text-indigo-300">{selectedConversation.clientName[0]}</div>}
                                        <div className={`max-w-md p-3 rounded-lg ${isAgent ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                            {isAgent && agent && <p className="text-xs font-bold mb-1 opacity-70">{agent.name}</p>}
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        {isAgent && agent && <img src={agent.avatarUrl} alt={agent.name} className="w-8 h-8 rounded-full flex-shrink-0"/>}
                                    </div>
                                )
                            })}
                        </div>
                         <div className="mt-4 pt-4 border-t border-slate-700/50">
                            <div className="flex items-center">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Digite sua resposta..."
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                                <button onClick={handleSendMessage} className="ml-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={!newMessage.trim()}>
                                    <SendIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                     <div className="h-full flex items-center justify-center text-slate-500">
                        <p>Selecione uma conversa para visualizar.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
