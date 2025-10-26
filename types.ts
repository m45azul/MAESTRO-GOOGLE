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
  company: string;
  value: number;
  stage: PipelineStage;
  responsibleId: string | null;
  tags: string[];
  isDeleted?: boolean;
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  type: 'Reunião' | 'Audiência' | 'Prazo Processual' | 'Follow-up';
}

export interface CaseUpdate {
  id: string;
  date: string; // YYYY-MM-DD
  author: string;
  description: string;
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  clientId: string;
  contractId?: string;
  status: 'Ativo' | 'Suspenso' | 'Arquivado';
  responsibleId: string;
  updates: CaseUpdate[];
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
  email: string;
  conversionDate: string;
  originLeadId: string;
}

export interface Contract {
    id: string;
    clientId: string;
    type: 'Fixo' | 'Percentual' | 'Êxito' | 'Híbrido';
    value: number;
    startDate: string;
}

export interface PredictiveAnalysis {
  probabilidadeExito: number;
  tempoEstimado: number; // in months
  valorCondenacao: number;
}