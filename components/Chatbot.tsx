import React, { useState, useRef, useEffect } from 'react';
import { BotIcon, SendIcon, XIcon, SparklesIcon } from './icons.tsx';
import { getChatbotResponse } from '../services/geminiService.ts';
import { BotChatMessage } from '../types.ts';

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<BotChatMessage[]>([
        { id: '1', text: 'Olá! Eu sou a Maestro AI. Como posso ajudar você hoje?', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        const userMessage: BotChatMessage = {
            id: `msg-${Date.now()}`,
            text: inputValue,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await getChatbotResponse(inputValue);
            const botMessage: BotChatMessage = {
                id: `msg-${Date.now() + 1}`,
                text: response,
                sender: 'bot',
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: BotChatMessage = {
                id: `msg-${Date.now() + 1}`,
                text: 'Desculpe, ocorreu um erro ao me comunicar com a IA. Tente novamente.',
                sender: 'bot',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110"
                aria-label="Open chatbot"
            >
                {isOpen ? <XIcon className="w-6 h-6" /> : <BotIcon className="w-6 h-6" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 flex flex-col transition-all">
                    <header className="flex items-center justify-between p-4 border-b border-slate-700">
                        <div className="flex items-center">
                            <SparklesIcon className="w-5 h-5 text-indigo-400" />
                            <h3 className="ml-2 font-bold text-white">Maestro AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                           <XIcon className="w-5 h-5"/>
                        </button>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && <BotIcon className="w-6 h-6 text-indigo-400 flex-shrink-0 mb-1"/>}
                                <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-end gap-2">
                                <BotIcon className="w-6 h-6 text-indigo-400 flex-shrink-0 mb-1"/>
                                <div className="max-w-xs p-3 rounded-lg bg-slate-700 text-slate-200">
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <footer className="p-4 border-t border-slate-700">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Pergunte algo..."
                                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                            <button onClick={handleSendMessage} disabled={isLoading} className="ml-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};