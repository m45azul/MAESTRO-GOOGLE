// This file consolidates all mock data to be used by the simulated apiService.

import { Lead, LegalCase, Client, Transaction, Appointment, MuralPost, ChatMessage, ChatConversation, User, Task, Tag, SupportConversation, SupportMessage, Meta, RankingItem } from '../types.ts';

// --- USERS ---
export const mockUsers: User[] = [
    { id: 'user-maestro', name: 'Maestro Supremo', email: 'maestro@maestro.law', role: 'MAESTRO', avatarUrl: 'https://i.pravatar.cc/150?u=maestro', cpf: '111.111.111-11', phone: '(11) 99999-0001', status: 'Ativo' },
    { id: 'user-socio', name: 'Dr. Fernando Alves', email: 'fernando@maestro.law', role: 'Sócio', avatarUrl: 'https://i.pravatar.cc/150?u=fernando', cpf: '222.222.222-22', phone: '(11) 99999-0002', status: 'Ativo' },
    { id: 'user-controller', name: 'Dr. Ricardo Neves', email: 'ricardo@maestro.law', role: 'Controller', avatarUrl: 'https://i.pravatar.cc/150?u=ricardo', cpf: '333.333.333-33', phone: '(11) 99999-0003', oabNumber: 'SP12345', status: 'Ativo', valorHora: 350 },
    { id: 'user-adv-1', name: 'Dr. Carlos Andrade', email: 'carlos@maestro.law', role: 'Advogado Interno', avatarUrl: 'https://i.pravatar.cc/150?u=carlos', cpf: '444.444.444-44', phone: '(11) 99999-0004', oabNumber: 'SP54321', funcaoComercialHabilitada: true, status: 'Ativo', valorHora: 250 },
    { id: 'user-adv-2', name: 'Dra. Beatriz Lima', email: 'beatriz@maestro.law', role: 'Advogado Interno', avatarUrl: 'https://i.pravatar.cc/150?u=beatriz', cpf: '555.555.555-55', phone: '(11) 99999-0005', oabNumber: 'SP67890', funcaoComercialHabilitada: false, status: 'Ativo', valorHora: 250 },
    { id: 'user-adv-parceiro', name: 'Dra. Sofia Rocha', email: 'sofia.parceira@external.law', role: 'Advogado Parceiro', avatarUrl: 'https://i.pravatar.cc/150?u=sofia', cpf: '666.666.666-66', phone: '(11) 99999-0006', oabNumber: 'RJ12345', status: 'Ativo', valorHora: 300 },
    { id: 'user-sdr-1', name: 'Juliana Costa', email: 'juliana@maestro.law', role: 'SDR', avatarUrl: 'https://i.pravatar.cc/150?u=juliana', cpf: '777.777.777-77', phone: '(11) 99999-0007', status: 'Ativo' },
    { id: 'user-sdr-2', name: 'João SDR', email: 'joao.sdr@maestro.law', role: 'SDR', avatarUrl: 'https://i.pravatar.cc/150?u=joao', cpf: '888.888.888-88', phone: '(11) 99999-0008', status: 'Inativo' },
    { id: 'user-admin', name: 'Roberto Silva', email: 'roberto.admin@maestro.law', role: 'Administrativo', avatarUrl: 'https://i.pravatar.cc/150?u=roberto', cpf: '999.999.999-99', phone: '(11) 99999-0009', status: 'Ativo' },
    { id: 'user-atendimento', name: 'Camila Dias', email: 'camila.atendimento@maestro.law', role: 'Operador de Atendimento', avatarUrl: 'https://i.pravatar.cc/150?u=camila', cpf: '101.010.101-01', phone: '(11) 99999-0010', status: 'Ativo' },
    { id: 'user-parceiro-ind', name: 'Contabilidade ABC', email: 'contato@contabilidadeabc.com', role: 'Parceiro Indicador', avatarUrl: 'https://i.pravatar.cc/150?u=contador', status: 'Ativo' },
    { id: 'user-parceiro-sdr', name: 'Vendas Pro', email: 'contato@vendaspro.com', role: 'Parceiro SDR', avatarUrl: 'https://i.pravatar.cc/150?u=vendassdr', status: 'Ativo' },
    { id: 'user-parceiro-outro', name: 'Perícia Técnica XYZ', email: 'contato@periciaxyz.com', role: 'Parceiro Outros', avatarUrl: 'https://i.pravatar.cc/150?u=pericia', status: 'Inativo' },
];
export const userMap: Map<string, User> = new Map(mockUsers.map(user => [user.id, user]));

// --- TAGS ---
export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Direito Civil', color: '#3b82f6', category: 'area_atuacao', description: 'Assuntos relacionados a direito civil geral.', icon: 'FileText', isActive: true },
  { id: 'tag-2', name: 'Contratos', color: '#3b82f6', category: 'area_atuacao', description: 'Elaboração e revisão de contratos.', icon: 'Contract', isActive: true },
  { id: 'tag-3', name: 'Direito Trabalhista', color: '#10b981', category: 'area_atuacao', description: 'Questões relacionadas a leis trabalhistas.', icon: 'Briefcase', isActive: true },
  { id: 'tag-4', name: 'Direito Imobiliário', color: '#6366f1', category: 'area_atuacao', description: 'Questões de propriedade e transações imobiliárias.', icon: 'Building', isActive: false },
  { id: 'tag-5', name: 'Alto Valor (R$ 50k+)', color: '#ef4444', category: 'potencial', description: 'Leads com valor estimado acima de R$50.000.', icon: 'ArrowUpRight', isActive: true },
  { id: 'tag-6', name: 'Médio Valor (R$ 10k-50k)', color: '#f97316', category: 'potencial', description: 'Leads com valor estimado entre R$10.000 e R$50.000.', icon: '', isActive: true },
  { id: 'tag-7', name: 'Baixo Valor (< R$ 10k)', color: '#eab308', category: 'potencial', description: 'Leads com valor estimado abaixo de R$10.000.', icon: '', isActive: true },
  { id: 'tag-8', name: 'Crítica (SLA 4h)', color: '#dc2626', category: 'prioridade', description: 'Demandas com necessidade de resposta em até 4 horas.', icon: 'AlertTriangle', isActive: true },
  { id: 'tag-9', name: 'Alta (SLA 24h)', color: '#f59e0b', category: 'prioridade', description: 'Demandas com necessidade de resposta em até 24 horas.', icon: 'AlertCircle', isActive: true },
];
export const tagMap: Map<string, Tag> = new Map(mockTags.map(tag => [tag.id, tag]));

// --- LEADS ---
export const mockLeads: Lead[] = [
  { id: 'lead-1', name: 'Global Tech Inc.', email: 'contato@globaltech.com', phone: '(11) 91234-5678', company: 'Tecnologia', value: 75000, stage: 'Proposta', responsibleId: 'user-sdr-1', origin: 'Google Ads', description: 'Busca por assessoria em direito digital e LGPD.', tags: ['tag-5'] },
  { id: 'lead-2', name: 'Soluções Jurídicas Alfa', email: 'ceo@alfa.law', phone: '(11) 98765-4321', company: 'Serviços Jurídicos', value: 45000, stage: 'Qualificado', responsibleId: 'user-sdr-2', origin: 'Indicação Parceiro', originPartnerId: 'user-parceiro-ind', description: 'Interessado em parceria para casos tributários.', tags: ['tag-6'] },
  { id: 'lead-3', name: 'Construtora Horizonte', email: 'engenharia@horizonte.com', phone: '(31) 99999-8888', company: 'Construção Civil', value: 120000, stage: 'Novo', responsibleId: null, origin: 'Site Orgânico', description: 'Necessidade de regularização de 3 empreendimentos.', tags: ['tag-4'] },
  { id: 'lead-4', name: 'Varejo Ponto Certo', email: 'gerencia@varejocerto.com', phone: '(21) 98888-7777', company: 'Varejo', value: 30000, stage: 'Negociação', responsibleId: 'user-sdr-1', origin: 'LinkedIn', description: 'Revisão de contratos com fornecedores.', tags: ['tag-2', 'tag-7'] },
  { id: 'lead-5', name: 'AgroBrasil S.A.', email: 'juridico@agrobrasil.com', phone: '(62) 97777-6666', company: 'Agronegócio', value: 250000, stage: 'Qualificado', responsibleId: 'user-sdr-2', origin: 'Evento', description: 'Grande demanda em questões trabalhistas rurais.', tags: ['tag-3', 'tag-5'] },
  { id: 'lead-6', name: 'Inovações em Saúde', email: 'startup@inovasaude.com', phone: '(41) 96666-5555', company: 'Saúde', value: 95000, stage: 'Contatado', responsibleId: 'user-sdr-1', origin: 'Referência Cliente', description: 'Busca por consultoria em patentes e propriedade intelectual.', tags: ['tag-2'] },
  { id: 'lead-7', name: 'Logística Express', email: 'diretoria@logexpress.com', phone: '(51) 95555-4444', company: 'Logística', value: 60000, stage: 'Novo', responsibleId: null, origin: 'Cold Call', description: '', tags: [] },
];

// --- CLIENTS ---
export const mockClients: Client[] = [
    { id: 'client-1', name: 'Maria Santos', type: 'Pessoa Física', cpfCnpj: '123.456.789-00', email: 'maria.santos@example.com', phone: '(11) 98765-4321', conversionDate: '2025-08-10', originLeadId: 'lead-mock-01', notes: [
        { id: 'note-1', authorId: 'user-sdr-1', content: 'Cliente mencionou interesse em expansão para o mercado imobiliário. Pode ser uma oportunidade futura.', timestamp: '2025-10-20T14:30:00Z' },
        { id: 'note-2', authorId: 'user-adv-1', content: 'Reunião de alinhamento sobre o processo de P.I. realizada. Cliente ciente dos próximos passos.', timestamp: '2025-10-22T11:00:00Z' }
    ]},
    { id: 'client-2', name: 'Construtora Horizonte', type: 'Pessoa Jurídica', cpfCnpj: '12.345.678/0001-99', email: 'contato@construtorahorizonte.com', phone: '(31) 3333-4444', conversionDate: '2025-09-01', originLeadId: 'lead-3', notes: [] },
    { id: 'client-3', name: 'Varejo Ponto Certo', type: 'Pessoa Jurídica', cpfCnpj: '98.765.432/0001-11', email: 'compras@varejopontocerto.com', phone: '(21) 2222-5555', conversionDate: '2025-09-15', originLeadId: 'lead-4', notes: [] },
    { id: 'client-4', name: 'Global Tech Inc.', type: 'Pessoa Jurídica', cpfCnpj: '55.666.777/0001-00', email: 'legal@globaltech.com', phone: '(11) 5555-6666', conversionDate: '2025-09-22', originLeadId: 'lead-1', notes: [] },
    { id: 'client-5', name: 'Soluções Jurídicas Alfa', type: 'Pessoa Jurídica', cpfCnpj: '44.555.666/0001-00', email: 'contato@alfa.law', phone: '(11) 1234-5678', conversionDate: '2025-08-20', originLeadId: 'lead-2', notes: [] },
    { id: 'client-6', name: 'AgroBrasil S.A.', type: 'Pessoa Jurídica', cpfCnpj: '33.444.555/0001-00', email: 'juridico@agrobrasil.com', phone: '(62) 3000-4000', conversionDate: '2025-10-01', originLeadId: 'lead-5', notes: [] },
    { id: 'client-7', name: 'Inovações em Saúde', type: 'Pessoa Jurídica', cpfCnpj: '22.333.444/0001-00', email: 'ceo@inovasaude.com', phone: '(41) 3131-2121', conversionDate: '2025-10-05', originLeadId: 'lead-6', notes: [] },
    { id: 'client-8', name: 'Logística Express', type: 'Pessoa Jurídica', cpfCnpj: '11.222.333/0001-00', email: 'diretoria@logisticaexpress.com', phone: '(51) 3232-4545', conversionDate: '2025-10-12', originLeadId: 'lead-7', notes: [] },
];
export const clientMap: Map<string, Client> = new Map(mockClients.map(c => [c.id, c]));

// --- CASES ---
export const mockCases: LegalCase[] = [
    {
        id: 'case-1',
        processNumber: '0012345-67.2025.8.26.0001',
        title: 'Ação de Indenização por Danos Morais - Maria Santos vs. Cia Aérea Voar Alto',
        clientId: 'client-1',
        status: 'Ativo',
        responsibleId: 'user-adv-1',
        controllerId: 'user-controller',
        opposingParty: 'Cia Aérea Voar Alto',
        court: '5ª Vara Cível - Foro Central de São Paulo',
        updates: [
            { id: 'u1-1', date: '2025-10-15', author: 'Dr. Carlos Andrade', description: 'Petição inicial protocolada.' },
            { id: 'u1-2', date: '2025-10-20', author: 'Sistema do Tribunal', description: 'Processo distribuído para a 5ª Vara Cível.' },
        ],
        timesheet: [
             { id: 'ts1-1', date: '2025-10-14', hours: 3.5, description: 'Elaboração da petição inicial.', userId: 'user-adv-1', status: 'Pendente' },
             { id: 'ts1-2', date: '2025-10-15', hours: 1.0, description: 'Protocolo e distribuição do processo.', userId: 'user-adv-1', status: 'Pendente' },
        ],
        tags: ['tag-1', 'tag-9'],
        valorCausa: 25000,
        honorariosPrevistos: 7500,
        percentualAdvogado: 30,
        documents: [
            { id: 'doc-1', name: 'Peticao_Inicial.pdf', url: '#', uploadDate: '2025-10-15T10:00:00Z', version: 1 }
        ],
        tribunal: 'TJSP',
        complexidade: 'Simples',
    },
    {
        id: 'case-2',
        processNumber: '0098765-43.2025.8.26.0100',
        title: 'Revisão de Contrato de Aluguel Comercial - Varejo Ponto Certo',
        clientId: 'client-3',
        status: 'Ativo',
        responsibleId: 'user-adv-2',
        controllerId: 'user-controller',
        opposingParty: 'Shopping Center Plaza',
        court: '10ª Vara Empresarial - São Paulo',
        updates: [
            { id: 'u2-1', date: '2025-09-28', author: 'Dra. Beatriz Lima', description: 'Notificação extrajudicial enviada ao locador.' },
            { id: 'u2-2', date: '2025-10-10', author: 'Dra. Beatriz Lima', description: 'Reunião de negociação com a outra parte agendada.' },
        ],
        timesheet: [],
        tags: ['tag-2', 'tag-4'],
        valorCausa: 80000,
        honorariosPrevistos: 12000,
        percentualAdvogado: 30,
        documents: [],
        tribunal: 'TJSP',
        complexidade: 'Médio',
    },
     {
        id: 'case-3',
        processNumber: '0712345-00.2025.8.02.0001',
        title: 'Defesa Trabalhista - Construtora Horizonte',
        clientId: 'client-2',
        status: 'Suspenso',
        responsibleId: 'user-adv-1',
        controllerId: 'user-controller',
        opposingParty: 'Sindicato dos Trabalhadores',
        court: '2ª Vara do Trabalho de Belo Horizonte',
        updates: [
            { id: 'u3-1', date: '2025-09-05', author: 'Dr. Carlos Andrade', description: 'Contestação protocolada.' },
            { id: 'u3-2', date: '2025-10-01', author: 'Sistema do Tribunal', description: 'Audiência de conciliação designada para 30/11/2025.' },
        ],
        timesheet: [],
        tags: ['tag-3'],
        valorCausa: 150000,
        honorariosPrevistos: 30000,
        percentualAdvogado: 20,
        documents: [],
        tribunal: 'TRT-3',
        complexidade: 'Complexo',
    },
];

// --- TRANSACTIONS ---
export const mockTransactions: Transaction[] = [
    { id: 'trans-1', date: '2025-10-25', description: 'Recebimento Honorários - Caso #1', category: 'Honorários Advocatícios', value: 15000, type: 'Receita', status: 'Realizado', reconciled: true },
    { id: 'trans-2', date: '2025-10-22', description: 'Pagamento de Contas - Energia Elétrica', category: 'Despesas Operacionais', value: 350, type: 'Despesa', status: 'Realizado', reconciled: false },
    { id: 'trans-3', date: '2025-10-20', description: 'Adiantamento de Custas - Processo #2', category: 'Custas Processuais', value: 1200, type: 'Despesa', status: 'Realizado', reconciled: false },
    { id: 'trans-4', date: '2025-11-05', description: 'Recebimento Honorários - Caso #2', category: 'Honorários Advocatícios', value: 12000, type: 'Receita', status: 'Previsto', reconciled: false },
];

// --- APPOINTMENTS ---
export const mockAppointments: Appointment[] = [
    { id: 'app-1', date: '2025-10-26', time: '10:00', title: 'Reunião com Cliente - Maria Santos', type: 'Reunião', participantIds: ['user-adv-1', 'client-1'], caseId: 'case-1' },
    { id: 'app-2', date: '2025-10-26', time: '14:30', title: 'Audiência - Caso Construtora Horizonte', type: 'Audiência', participantIds: ['user-adv-1'], caseId: 'case-2' },
    { id: 'app-3', date: '2025-10-28', time: '18:00', title: 'Prazo Final - Apelação Processo XYZ', type: 'Prazo Processual', participantIds: ['user-adv-2'], caseId: 'case-3' },
    { id: 'app-4', date: '2025-11-02', time: '09:00', title: 'Follow-up com Lead Global Tech', type: 'Follow-up', participantIds: ['user-sdr-1'], description: 'Ligar para discutir a proposta enviada.'},
];

// --- TASKS ---
export const mockTasks: Task[] = [
    { id: 'task-1', title: 'Elaborar recurso de apelação', type: 'Critical Deadline', priority: 'Crítica', dueDate: '28/10/2025', assignedTo: 'user-adv-2' },
    { id: 'task-2', title: 'Aprovar despesa de R$ 7.500', type: 'Approval', priority: 'Alta', dueDate: '27/10/2025', assignedTo: 'user-controller' },
    { id: 'task-3', title: 'Ligar para Varejo Ponto Certo', type: 'Follow-up', priority: 'Média', dueDate: '26/10/2025', assignedTo: 'user-sdr-1' },
];

// --- MURAL ---
export const mockMuralPosts: MuralPost[] = [
    { id: 'post-1', authorId: 'user-maestro', content: 'Parabéns à equipe pelo excelente resultado no último trimestre! Continuem com o ótimo trabalho. 🚀', timestamp: '2025-10-25T09:00:00Z', likes: ['user-adv-1', 'user-sdr-1'], comments: [
        { id: 'c-1', authorId: 'user-adv-1', content: 'Obrigado, Maestro! Time focado!', timestamp: '2025-10-25T09:15:00Z' }
    ]},
    { id: 'post-2', authorId: 'user-controller', content: 'Lembrete: O prazo para lançamento de horas da semana se encerra hoje às 18h. Não deixem para a última hora.', timestamp: '2025-10-24T10:30:00Z', likes: [], comments: [] },
];

// --- CHAT ---
export const mockChatConversations: ChatConversation[] = [
    { id: 'user-adv-1', name: 'Dr. Carlos Andrade', unread: 2, type: 'user' },
    { id: 'user-sdr-1', name: 'Juliana Costa', unread: 0, type: 'user' },
    { id: 'group-juridico', name: 'Grupo Jurídico', unread: 5, type: 'group' },
];

export const mockChatMessages: ChatMessage[] = [
    { id: 'msg-1', fromId: 'user-adv-1', toId: 'user-maestro', content: 'Preciso da sua aprovação no parecer do caso #2.', timestamp: '2025-10-26T10:00:00Z', read: false },
    { id: 'msg-2', fromId: 'user-adv-1', toId: 'user-maestro', content: 'É urgente, o prazo é amanhã.', timestamp: '2025-10-26T10:01:00Z', read: false },
    { id: 'msg-3', fromId: 'user-maestro', toId: 'user-adv-1', content: 'Recebido. Vou analisar agora.', timestamp: '2025-10-26T10:05:00Z', read: true },
];

// --- GOALS & RANKING ---
export const mockMetas: Meta[] = [
    { id: 'meta-1', title: 'Converter Leads em Clientes', type: 'Quantitativa', target: 10, current: 7, period: 'Mensal', assigneeId: 'user-sdr-1' },
    { id: 'meta-2', title: 'Faturamento de Honorários', type: 'Financeira', target: 50000, current: 42550, period: 'Mensal', assigneeId: 'team-legal' },
    { id: 'meta-3', title: 'Taxa de Sucesso em Casos', type: 'Qualitativa', target: 92, current: 91, period: 'Trimestral', assigneeId: 'team-legal' },
];

export const mockRanking: RankingItem[] = [
    { userId: 'user-adv-1', name: 'Dr. Carlos Andrade', metric: 'Casos Fechados', value: 8, rank: 1 },
    { userId: 'user-sdr-1', name: 'Juliana Costa', metric: 'Leads Convertidos', value: 7, rank: 2 },
    { userId: 'user-adv-2', name: 'Dra. Beatriz Lima', metric: 'Casos Fechados', value: 6, rank: 3 },
];

// --- SUPPORT ---
export const mockSupportConversations: SupportConversation[] = [
    { id: 'conv-1', clientName: 'João da Silva (Novo Lead)', clientContact: '+5511988887777', channel: 'WhatsApp', status: 'open', lastMessage: 'Gostaria de saber mais sobre seus serviços para startups.', unreadCount: 1, assignedAgentId: 'user-atendimento' },
    { id: 'conv-2', clientName: 'Maria Santos', clientContact: 'maria.santos@example.com', channel: 'Email', status: 'pending', lastMessage: 'Enviei os documentos que faltavam. Podem confirmar o recebimento?', unreadCount: 0, assignedAgentId: 'user-atendimento' },
];

export const mockSupportMessages: SupportMessage[] = [
    { id: 'sup-msg-1', conversationId: 'conv-1', sender: 'client', content: 'Olá, vi o anúncio de vocês. Gostaria de saber mais sobre seus serviços para startups.', timestamp: '2025-10-26T11:00:00Z' },
    { id: 'sup-msg-2', conversationId: 'conv-1', sender: 'agent', agentId: 'user-atendimento', content: 'Olá João, seja bem-vindo! Claro, posso ajudar. Qual a principal necessidade da sua startup hoje?', timestamp: '2025-10-26T11:02:00Z' },
];