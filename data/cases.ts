import type { LegalCase } from '../types';

export const mockCases: LegalCase[] = [
    {
        id: '1',
        caseNumber: '071.2025.123456-7',
        title: 'Reclamação Trabalhista vs. Global Tech Inc.',
        clientId: 'client-1', // Maria Santos
        status: 'Ativo',
        responsibleId: 'user-1', // Dr. Carlos Andrade
        updates: [
            { id: 'u1-1', date: '2025-10-15', author: 'Sistema', description: 'Processo distribuído para a 3ª Vara do Trabalho.' },
            { id: 'u1-2', date: '2025-10-20', author: 'Dr. Carlos Andrade', description: 'Petição inicial elaborada e protocolada.' },
            { id: 'u1-3', date: '2025-10-26', author: 'Sistema', description: 'Publicação de audiência de conciliação para 15/11/2025.' },
        ],
        tags: ['tag-3', 'tag-9'], // Direito Trabalhista, Alta
        valorCausa: 150000,
        honorariosPrevistos: 45000,
        percentualAdvogado: 30
    },
    {
        id: '2',
        caseNumber: '102.2024.987654-3',
        title: 'Ação de Despejo vs. Inquilino X',
        clientId: 'client-2', // Construtora Horizonte
        status: 'Ativo',
        responsibleId: 'user-2', // Dra. Beatriz Lima
        updates: [
            { id: 'u2-1', date: '2024-12-10', author: 'Dra. Beatriz Lima', description: 'Ajuizada ação de despejo por falta de pagamento.' },
            { id: 'u2-2', date: '2025-02-05', author: 'Sistema', description: 'Citação do réu confirmada.' },
        ],
        tags: ['tag-4'], // Direito Imobiliário
        valorCausa: 80000,
        honorariosPrevistos: 24000,
        percentualAdvogado: 30
    },
    {
        id: '3',
        caseNumber: '003.2023.112233-4',
        title: 'Defesa em Ação Indenizatória',
        clientId: 'client-3', // Varejo Ponto Certo
        status: 'Arquivado',
        responsibleId: 'user-3', // Dr. Ricardo Neves
        updates: [
             { id: 'u3-1', date: '2023-08-01', author: 'Dr. Ricardo Neves', description: 'Contestação apresentada.' },
             { id: 'u3-2', date: '2024-05-20', author: 'Sistema', description: 'Sentença de improcedência publicada. Favorável.' },
             { id: 'u3-3', date: '2024-07-15', author: 'Dr. Ricardo Neves', description: 'Processo transitado em julgado. Arquivado com êxito.' },
        ],
        tags: ['tag-1'], // Direito Civil
        valorCausa: 25000,
        honorariosPrevistos: 5000,
        percentualAdvogado: 20
    }
];
