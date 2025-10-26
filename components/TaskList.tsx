
import React, { useState } from 'react';
import type { Task } from '../types';
import { Card } from './Card';

const initialTasks: Task[] = [
    { id: '1', title: 'Aprovar despesa do processo 2025-001', type: 'Approval', priority: 'Crítica', dueDate: '26/10/2025' },
    { id: '2', title: 'Prazo final para contestação - Processo 2025-157', type: 'Critical Deadline', priority: 'Crítica', dueDate: '27/10/2025' },
    { id: '3', title: 'Revisar contrato do cliente "Tech Solutions Ltda"', type: 'Approval', priority: 'Alta', dueDate: '28/10/2025' },
    { id: '4', title: 'Follow-up com lead "Grande Empresa S.A."', type: 'Follow-up', priority: 'Média', dueDate: '29/10/2025'},
    { id: '5', title: 'Alerta: Processo 2024-889 sem andamento há 30 dias', type: 'Critical Deadline', priority: 'Alta', dueDate: 'N/A' },
];

const priorityStyles = {
    'Crítica': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Alta': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Média': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

export const TaskList: React.FC = () => {
    const [tasks] = useState<Task[]>(initialTasks);

    return (
        <Card className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Tarefas e Alertas Críticos</h3>
            <div className="space-y-3 pr-2 overflow-y-auto max-h-[300px]">
                {tasks.map(task => (
                    <div key={task.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 flex justify-between items-center hover:bg-slate-700/50 transition-colors">
                        <div>
                            <p className="font-medium text-slate-200">{task.title}</p>
                            <p className="text-xs text-slate-400">Vencimento: {task.dueDate}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
                            {task.priority}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
