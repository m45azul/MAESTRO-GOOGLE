export interface Task {
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

export interface User {
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

export interface LawyerPerformance {
  id: string;
  name: string;
  avatarUrl: string;
  casesCompleted: number;
  successRate: number;
}

export type PipelineStage = 'Novo' | 'Contatado' | 'Qualificado' | 'Proposta' | 'Negociação' | 'Ganho' | 'Perdido';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  stage: PipelineStage;
  responsibleId: string | null;
  origin: string;
  description: string;
  tags: string[];
  isDeleted?: boolean;
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  type: 'Reunião' | 'Audiência' | 'Prazo Processual' | 'Follow-up';
  participantIds: string[];
  description?: string;
}

export interface CaseUpdate {
  id: string;
  date: string; // YYYY-MM-DD
  author: string;
  description: string;
}

export interface TimeLog {
  id: string;
  date: string;
  hours: number;
  description: string;
  userId: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export interface LegalCase {
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
}

export type TransactionType = 'Receita' | 'Despesa';
export type TransactionStatus = 'Previsto' | 'Realizado' | 'Cancelado';

export interface Transaction {
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

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
}

export interface CarteiraProcesso {
    id: string;
    title: string;
    honorariosPrevistos: number;
    percentualAdvogado: number;
    valorCarteira: number;
}

export interface Carteira {
    salarioFixo: number;
    ajudaCusto: number;
    totalFixo: number;
    processos: CarteiraProcesso[];
    totalVariavel: number;
    totalGeral: number;
}

export interface Client {
  id: string;
  name: string;
  type: 'Pessoa Física' | 'Pessoa Jurídica';
  cpfCnpj: string;
  email: string;
  phone: string;
  conversionDate: string;
  originLeadId: string;
  isDeleted?: boolean;
}

export interface Contract {
    id: string;
    clientId: string;
    type: 'Fixo' | 'Percentual' | 'Êxito' | 'Híbrido';
    value: number;
    description: string;
    startDate: string;
}

export interface PredictiveAnalysis {
  probabilidadeExito: number;
  tempoEstimado: number; // in months
  valorCondenacao: number;
}

export type WorkflowNodeType = 'trigger' | 'action' | 'condition';
export type WorkflowModule = 'CRM' | 'Jurídico' | 'Financeiro' | 'Atendimento' | 'Agenda' | 'Sistema';

export interface WorkflowNode {
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

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
}

export interface Comment {
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
}

export interface MuralPost {
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
    likes: string[]; // array of user IDs
    comments: Comment[];
}

export interface ChatConversation {
    id: string;
    name: string;
    unread: number;
    type: 'user' | 'group';
}

export interface Meta {
    id: string;
    title: string;
    type: 'Quantitativa' | 'Financeira' | 'Qualitativa';
    target: number;
    current: number;
    period: 'Mensal' | 'Trimestral';
    assigneeId: string; // user or team ID
}

export interface BotChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export interface ChatMessage {
  id: string;
  fromId: string;
  toId: string; // Can be a userId or a groupId
  content: string;
  timestamp: string;
  read: boolean;
}
