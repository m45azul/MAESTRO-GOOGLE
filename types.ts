export type Task = {
  id: string;
  title: string;
  type: 'Approval' | 'Critical Deadline' | 'Follow-up';
  priority: 'Crítica' | 'Alta' | 'Média';
  dueDate: string;
  assignedTo?: string;
}

export type UserRole =
  | 'MAESTRO'
  | 'Sócio'
  | 'Controller'
  | 'Advogado Interno'
  | 'Advogado Parceiro'
  | 'SDR'
  | 'Administrativo'
  | 'Operador de Atendimento'
  | 'Parceiro Indicador'
  | 'Parceiro SDR'
  | 'Parceiro Outros';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  oabNumber?: string;
  cpf?: string;
  phone?: string;
  funcaoComercialHabilitada?: boolean;
  status?: 'Ativo' | 'Inativo';
  valorHora?: number;
}

export type LawyerPerformance = {
  id: string;
  name: string;
  avatarUrl: string;
  casesCompleted: number;
  successRate: number;
}

export type PipelineStage = 'Novo' | 'Contatado' | 'Qualificado' | 'Proposta' | 'Negociação' | 'Ganho' | 'Perdido';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  stage: PipelineStage;
  responsibleId: string | null;
  origin: string;
  originPartnerId?: string;
  description: string;
  tags: string[];
  isDeleted?: boolean;
}

export type Appointment = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  type: 'Reunião' | 'Audiência' | 'Prazo Processual' | 'Follow-up';
  participantIds: string[];
  description?: string;
  caseId?: string;
}

export type CaseUpdate = {
  id: string;
  date: string; // YYYY-MM-DD
  author: string;
  description: string;
}

export type TimeLog = {
  id: string;
  date: string;
  hours: number;
  description: string;
  userId: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export type Document = {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  version: number;
  extractedText?: string;
  // FIX: Added analysisStatus to track the state of AI document analysis.
  analysisStatus?: 'pending' | 'completed' | 'failed';
}

export type LegalCase = {
  id: string;
  processNumber: string;
  internalNumber?: string;
  title: string;
  clientId: string;
  contractId?: string;
  status: 'Ativo' | 'Suspenso' | 'Arquivado';
  responsibleId: string;
  controllerId?: string;
  opposingParty: string;
  court: string;
  updates: CaseUpdate[];
  timesheet: TimeLog[];
  tags: string[];
  valorCausa: number;
  honorariosPrevistos: number;
  percentualAdvogado: number;
  isDeleted?: boolean;
  documents: Document[];
  tribunal: string;
  complexidade: 'Simples' | 'Médio' | 'Complexo' | 'Muito Complexo';
}

export type TransactionType = 'Receita' | 'Despesa';
export type TransactionStatus = 'Previsto' | 'Realizado' | 'Cancelado';

export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: string;
  value: number;
  type: TransactionType;
  status: TransactionStatus;
  reconciled: boolean;
  centroCusto?: string;
  isDeleted?: boolean;
}

export type TagCategory = 'area_atuacao' | 'tipo_lead' | 'tipo_cliente' | 'tipo_processo' | 'complexidade' | 'prioridade' | 'jurisdicao' | 'competencia' | 'status' | 'origem' | 'segmento' | 'fase_processo' | 'instancia' | 'natureza' | 'localizacao' | 'tribunal' | 'habilidade' | 'nivel' | 'urgencia' | 'impacto' | 'canal' | 'potencial' | 'relacionamento';

export type Tag = {
  id: string;
  name: string;
  color: string;
  category: TagCategory;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export type CarteiraProcesso = {
    id: string;
    title: string;
    honorariosPrevistos: number;
    percentualAdvogado: number;
    valorCarteira: number;
}

export type Carteira = {
    salarioFixo: number;
    ajudaCusto: number;
    totalFixo: number;
    processos: CarteiraProcesso[];
    totalVariavel: number;
    totalGeral: number;
}

export type Note = {
  id: string;
  authorId: string;
  content: string;
  timestamp: string; // ISO string
}

export type Client = {
  id: string;
  name: string;
  type: 'Pessoa Física' | 'Pessoa Jurídica';
  cpfCnpj: string;
  email: string;
  phone: string;
  conversionDate: string;
  originLeadId: string;
  notes?: Note[];
  isDeleted?: boolean;
}

export type Contract = {
    id: string;
    clientId: string;
    type: 'Fixo' | 'Percentual' | 'Êxito' | 'Híbrido';
    value: number;
    description: string;
    startDate: string;
}

export type PredictiveAnalysis = {
  probabilidadeExito: number;
  tempoEstimado: number; // in months
  valorCondenacao: number;
}

export type WorkflowNodeType = 'trigger' | 'action' | 'condition';
export type WorkflowModule = 'CRM' | 'Jurídico' | 'Financeiro' | 'Atendimento' | 'Agenda' | 'Sistema';

export type WorkflowNode = {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description: string;
  module: WorkflowModule;
  iconName: 'Contract' | 'Legal' | 'Wallet' | 'Message' | 'Calendar' | 'Task' | 'Finance';
  condition?: {
      if: string;
      thenId: string;
      elseId: string;
  };
}

export type Workflow = {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
}

export type Comment = {
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
}

export type MuralPost = {
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
    likes: string[]; // array of user IDs
    comments: Comment[];
}

export type ChatConversation = {
    id: string;
    name: string;
    unread: number;
    type: 'user' | 'group';
}

export type Meta = {
    id: string;
    title: string;
    type: 'Quantitativa' | 'Financeira' | 'Qualitativa';
    target: number;
    current: number;
    period: 'Mensal' | 'Trimestral';
    assigneeId: string; // user or team ID
}

export type RankingItem = {
  userId: string;
  name: string;
  metric: string;
  value: number;
  rank: number;
}


export type BotChatMessage = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export type ChatMessage = {
  id: string;
  fromId: string;
  toId: string; // Can be a userId or a groupId
  content: string;
  timestamp: string;
  read: boolean;
}

// --- Bank Reconciliation Types ---

export type BankStatementItem = {
  id: string;
  date: string; // '2025-10-15'
  description: string; // 'PIX RECEBIDO - MARIA SANTOS'
  value: number; // 15000.00
  type: 'credit' | 'debit';
}

export type AIReconciliationSuggestion = {
  transactionId: string;
  confidenceScore: number;
  reason: string;
}

export type AIReconciliationResult = {
  summary: {
    totalLines: number;
    automaticMatches: number;
    suggestions: number;
    unmatched: number;
    autoMatchPercentage: number;
  };
  automaticMatches: Array<{
    statementItem: BankStatementItem;
    transaction: Transaction;
  }>;
  suggestions: Array<{
    statementItem: BankStatementItem;
    // FIX: Updated type to reflect the hydrated data structure which includes the full transaction object.
    suggestedTransactions: (AIReconciliationSuggestion & { transaction: Transaction })[];
  }>;
  unmatchedItems: Array<{
    statementItem: BankStatementItem;
    reason: string;
  }>;
}

// Atendimento Module Types
export type SupportMessage = {
  id: string;
  conversationId: string;
  sender: 'client' | 'agent' | 'bot';
  agentId?: string; // if sender is 'agent'
  content: string;
  timestamp: string;
}

export type SupportConversation = {
  id: string;
  clientName: string;
  clientContact: string; // phone number for whatsapp
  channel: 'WhatsApp' | 'Email' | 'Site Chat';
  status: 'open' | 'pending' | 'closed';
  lastMessage: string;
  unreadCount: number;
  assignedAgentId?: string;
}

// Main App Data Structure
export interface AppData {
    leads: Lead[];
    cases: LegalCase[];
    clients: Client[];
    contracts: Contract[];
    transactions: Transaction[];
    appointments: Appointment[];
    tasks: Task[];
    muralPosts: MuralPost[];
    chatConversations: ChatConversation[];
    chatMessages: ChatMessage[];
    users: User[];
    tags: Tag[];
    supportConversations: SupportConversation[];
    supportMessages: SupportMessage[];
    metas: Meta[];
    ranking: RankingItem[];
}