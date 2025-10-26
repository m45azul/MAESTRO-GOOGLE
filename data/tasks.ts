import type { Task } from '../types';

export const mockTasks: Task[] = [
    { id: '1', title: 'Aprovar despesa do processo 2025-001', type: 'Approval', priority: 'Crítica', dueDate: '26/10/2025' },
    { id: '2', title: 'Prazo final para contestação - Processo 2025-157', type: 'Critical Deadline', priority: 'Crítica', dueDate: '27/10/2025' },
    { id: '3', title: 'Revisar contrato do cliente "Tech Solutions Ltda"', type: 'Approval', priority: 'Alta', dueDate: '28/10/2025' },
    { id: '4', title: 'Follow-up com lead "Grande Empresa S.A."', type: 'Follow-up', priority: 'Média', dueDate: '29/10/2025'},
    { id: '5', title: 'Alerta: Processo 2024-889 sem andamento há 30 dias', type: 'Critical Deadline', priority: 'Alta', dueDate: 'N/A' },
];
