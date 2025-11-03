
import React from 'react';
import { Task } from '../types.ts';
import { Card } from './Card.tsx';

const priorityStyles = {
    'Crítica': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Alta': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Média': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

interface TaskListProps {
    tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <Card className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Tarefas e Alertas Críticos</h3>
            <div className="space-y-3 pr-2 overflow-y-auto flex-1">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 flex justify-between items-center hover:bg-slate-700/50 transition-colors">
                            <div>
                                <p className="font-medium text-slate-200">{task.title}</p>
                                <p className="text-xs text-slate-400">Vencimento: {task.dueDate}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
                                {task.priority}
                            </span>
                        </div>
                    ))
                ) : (
                     <div className="flex items-center justify-center h-full text-slate-500">
                        <p>Nenhuma tarefa crítica no momento. Bom trabalho!</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
