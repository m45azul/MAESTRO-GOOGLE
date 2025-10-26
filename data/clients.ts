import { Client } from '../types';

export const mockClients: Client[] = [
    { id: 'client-1', name: 'Maria Santos', type: 'Pessoa Física', cpfCnpj: '123.456.789-00', email: 'maria.santos@example.com', phone: '(11) 98765-4321', conversionDate: '2025-08-10', originLeadId: 'lead-mock-01' },
    { id: 'client-2', name: 'Construtora Horizonte', type: 'Pessoa Jurídica', cpfCnpj: '12.345.678/0001-99', email: 'contato@construtorahorizonte.com', phone: '(31) 3333-4444', conversionDate: '2025-09-01', originLeadId: 'lead-3' },
    { id: 'client-3', name: 'Varejo Ponto Certo', type: 'Pessoa Jurídica', cpfCnpj: '98.765.432/0001-11', email: 'compras@varejopontocerto.com', phone: '(21) 2222-5555', conversionDate: '2025-09-15', originLeadId: 'lead-4' },
    { id: 'client-4', name: 'Global Tech Inc.', type: 'Pessoa Jurídica', cpfCnpj: '55.666.777/0001-00', email: 'legal@globaltech.com', phone: '(11) 5555-6666', conversionDate: '2025-09-22', originLeadId: 'lead-1' },
    { id: 'client-5', name: 'Soluções Jurídicas Alfa', type: 'Pessoa Jurídica', cpfCnpj: '44.555.666/0001-00', email: 'contato@alfa.law', phone: '(11) 1234-5678', conversionDate: '2025-08-20', originLeadId: 'lead-2' },
    { id: 'client-6', name: 'AgroBrasil S.A.', type: 'Pessoa Jurídica', cpfCnpj: '33.444.555/0001-00', email: 'juridico@agrobrasil.com', phone: '(62) 3000-4000', conversionDate: '2025-10-01', originLeadId: 'lead-5' },
    { id: 'client-7', name: 'Inovações em Saúde', type: 'Pessoa Jurídica', cpfCnpj: '22.333.444/0001-00', email: 'ceo@inovasaude.com', phone: '(41) 3131-2121', conversionDate: '2025-10-05', originLeadId: 'lead-6' },
    { id: 'client-8', name: 'Logística Express', type: 'Pessoa Jurídica', cpfCnpj: '11.222.333/0001-00', email: 'diretoria@logisticaexpress.com', phone: '(51) 3232-4545', conversionDate: '2025-10-12', originLeadId: 'lead-7' },
];

export const clientMap = new Map(mockClients.map(c => [c.id, c]));