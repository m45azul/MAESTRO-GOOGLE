

import React from 'react';
import { WorkflowNode as WorkflowNodeType, WorkflowModule } from '../types.ts';
import { CalendarIcon, ContractIcon, FinanceIcon, LegalIcon, MessageSquareIcon, TaskIcon, WalletIcon } from './icons.tsx';

interface WorkflowNodeProps {
    node: WorkflowNodeType;
}

const ICONS: Record<WorkflowNodeType['iconName'], React.FC<React.SVGProps<SVGSVGElement>>> = {
    Contract: ContractIcon,
    Legal: LegalIcon,
    Wallet: WalletIcon,
    Message: MessageSquareIcon,
    Calendar: CalendarIcon,
    Task: TaskIcon,
    Finance: FinanceIcon,
};

const MODULE_COLORS: Record<WorkflowModule, string> = {
    CRM: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Jurídico: 'bg-red-500/20 text-red-400 border-red-500/30',
    Financeiro: 'bg-green-500/20 text-green-400 border-green-500/30',
    Atendimento: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Agenda: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Sistema: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const NODE_TYPE_COLORS = {
    trigger: 'border-indigo-500',
    action: 'border-slate-600',
    condition: 'border-amber-500',
}

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({ node }) => {
    const Icon = ICONS[node.iconName];
    const moduleColors = MODULE_COLORS[node.module] || MODULE_COLORS.Sistema;
    const typeBorders = NODE_TYPE_COLORS[node.type];

    return (
        <div className={`bg-slate-800/50 p-4 rounded-xl w-full max-w-sm mx-auto border-l-4 ${typeBorders} border border-slate-700`}>
            <div className="flex items-start">
                <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg ${moduleColors}`}>
                   {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div className="ml-4">
                    <h4 className="text-base font-bold text-white">{node.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{node.description}</p>
                    <span className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${moduleColors}`}>
                        Módulo: {node.module}
                    </span>
                </div>
            </div>
        </div>
    );
};