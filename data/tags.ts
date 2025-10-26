import { Tag } from '../types';

export const mockTags: Tag[] = [
  // Categoria 1: ÁREA DE ATUAÇÃO
  { id: 'tag-1', name: 'Direito Civil', color: '#3b82f6', category: 'Área de Atuação' },
  { id: 'tag-2', name: 'Contratos', color: '#3b82f6', category: 'Área de Atuação' },
  { id: 'tag-3', name: 'Direito Trabalhista', color: '#10b981', category: 'Área de Atuação' },
  { id: 'tag-4', name: 'Direito Imobiliário', color: '#6366f1', category: 'Área de Atuação' },
  // Categoria 2: CLASSIFICAÇÃO DE LEADS (Potencial)
  { id: 'tag-5', name: 'Alto Valor (R$ 50k+)', color: '#ef4444', category: 'Potencial' },
  { id: 'tag-6', name: 'Médio Valor (R$ 10k-50k)', color: '#f97316', category: 'Potencial' },
  { id: 'tag-7', name: 'Baixo Valor (< R$ 10k)', color: '#eab308', category: 'Potencial' },
  // Categoria 5: PRIORIDADE OPERACIONAL
  { id: 'tag-8', name: 'Crítica (SLA 4h)', color: '#dc2626', category: 'Prioridade' },
  { id: 'tag-9', name: 'Alta (SLA 24h)', color: '#f59e0b', category: 'Prioridade' },
];

export const tagMap = new Map(mockTags.map(tag => [tag.id, tag]));
