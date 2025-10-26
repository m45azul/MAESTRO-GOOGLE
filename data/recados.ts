import { Recado, Conversation } from '../types';

export const mockRecados: Recado[] = [
    { id: 'msg1', fromId: 'user-controller', toId: 'user-adv-1', content: 'Carlos, por favor, revise a petição do caso Global Tech até amanhã.', timestamp: '2025-10-26T10:00:00Z', read: false },
    { id: 'msg2', fromId: 'user-adv-1', toId: 'user-controller', content: 'Recebido, Ricardo. Farei a revisão hoje à tarde.', timestamp: '2025-10-26T10:05:00Z', read: true },
    { id: 'msg3', fromId: 'user-maestro', toId: 'group-advogados', content: 'Lembrete: Reunião geral de alinhamento amanhã às 9h.', timestamp: '2025-10-26T11:30:00Z', read: false },
    { id: 'msg4', fromId: 'user-sdr-1', toId: 'user-maestro', content: 'Fechamos o contrato com a Logística Express!', timestamp: '2025-10-26T14:00:00Z', read: true },
];

export const mockConversations: Conversation[] = [
    { id: 'user-adv-1', name: 'Dr. Carlos Andrade', unread: 1, type: 'user' },
    { id: 'user-controller', name: 'Dr. Ricardo Neves', unread: 0, type: 'user' },
    { id: 'group-advogados', name: 'Grupo: Advogados', unread: 1, type: 'group' },
    { id: 'user-sdr-1', name: 'Juliana Costa', unread: 0, type: 'user' },
    { id: 'user-maestro', name: 'Maestro Supremo', unread: 0, type: 'user' },
];