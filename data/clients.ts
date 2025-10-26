import { Client } from '../types';

// fix: Added missing properties to client objects to match the Client type.
export const mockClients: Client[] = [
    { id: 'client-1', name: 'Maria Santos', email: 'maria.santos@example.com', conversionDate: '2025-08-10', originLeadId: 'lead-mock-01' },
    { id: 'client-2', name: 'Construtora Horizonte', email: 'contato@construtorahorizonte.com', conversionDate: '2025-09-01', originLeadId: 'lead-3' },
    { id: 'client-3', name: 'Varejo Ponto Certo', email: 'compras@varejopontocerto.com', conversionDate: '2025-09-15', originLeadId: 'lead-4' },
    { id: 'client-4', name: 'Global Tech Inc.', email: 'legal@globaltech.com', conversionDate: '2025-09-22', originLeadId: 'lead-1' },
    { id: 'client-5', name: 'Soluções Jurídicas Alfa', email: 'contato@alfa.law', conversionDate: '2025-08-20', originLeadId: 'lead-2' },
    { id: 'client-6', name: 'AgroBrasil S.A.', email: 'juridico@agrobrasil.com', conversionDate: '2025-10-01', originLeadId: 'lead-5' },
    { id: 'client-7', name: 'Inovações em Saúde', email: 'ceo@inovasaude.com', conversionDate: '2025-10-05', originLeadId: 'lead-6' },
    { id: 'client-8', name: 'Logística Express', email: 'diretoria@logisticaexpress.com', conversionDate: '2025-10-12', originLeadId: 'lead-7' },
];

export const clientMap = new Map(mockClients.map(c => [c.id, c]));