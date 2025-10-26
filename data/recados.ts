import { MuralPost } from '../types';

export const mockMuralPosts: MuralPost[] = [
    { 
        id: 'post-1', 
        authorId: 'user-maestro', 
        content: 'Bem-vindos ao novo Mural do MAESTRO! Este espaço é para comunicados importantes e colaboração da equipe.', 
        timestamp: '2025-10-25T09:00:00Z', 
        likes: ['user-controller', 'user-adv-1'],
        comments: [
            { id: 'c-1', authorId: 'user-adv-1', content: 'Ótima iniciativa!', timestamp: '2025-10-25T09:05:00Z' }
        ]
    },
    { 
        id: 'post-2', 
        authorId: 'user-controller', 
        content: 'Lembrete de equipe: Por favor, atualizem os timesheets de todos os processos ativos até o final do dia.', 
        timestamp: '2025-10-26T10:30:00Z', 
        likes: ['user-adv-1', 'user-adv-2'],
        comments: []
    },
     { 
        id: 'post-3', 
        authorId: 'user-sdr-1', 
        content: 'Parabéns a todos pela meta de conversão batida este mês! 🎉', 
        timestamp: '2025-10-24T15:00:00Z', 
        likes: ['user-maestro', 'user-controller', 'user-sdr-2'],
        comments: [
            { id: 'c-2', authorId: 'user-maestro', content: 'Excelente trabalho, Juliana e equipe!', timestamp: '2025-10-24T15:10:00Z' },
            { id: 'c-3', authorId: 'user-sdr-2', content: 'Vamos com tudo!', timestamp: '2025-10-24T15:15:00Z' }
        ]
    },
];
