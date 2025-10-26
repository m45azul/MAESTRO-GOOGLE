import type { Lead } from '../types';

export const mockLeads: Lead[] = [
  { id: 'lead-1', name: 'Global Tech Inc.', company: 'Tecnologia', value: 75000, stage: 'Proposta', responsibleId: 'user-6', tags: ['tag-1', 'tag-5'] },
  { id: 'lead-2', name: 'Soluções Jurídicas Alfa', company: 'Serviços', value: 45000, stage: 'Qualificado', responsibleId: 'user-4', tags: ['tag-2', 'tag-6'] },
  { id: 'lead-3', name: 'Construtora Horizonte', company: 'Construção Civil', value: 120000, stage: 'Novo', responsibleId: null, tags: ['tag-4'] },
  { id: 'lead-4', name: 'Varejo Ponto Certo', company: 'Varejo', value: 30000, stage: 'Negociação', responsibleId: 'user-6', tags: ['tag-2', 'tag-7'] },
  { id: 'lead-5', name: 'AgroBrasil S.A.', company: 'Agronegócio', value: 250000, stage: 'Qualificado', responsibleId: 'user-4', tags: ['tag-3', 'tag-5'] },
  { id: 'lead-6', name: 'Inovações em Saúde', company: 'Saúde', value: 95000, stage: 'Contatado', responsibleId: 'user-6', tags: ['tag-2'] },
  { id: 'lead-7', name: 'Logística Express', company: 'Logística', value: 60000, stage: 'Novo', responsibleId: null, tags: [] },
];
