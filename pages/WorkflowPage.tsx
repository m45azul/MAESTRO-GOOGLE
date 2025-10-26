import React, { useState } from 'react';
import { Card } from '../components/Card';
import { mockWorkflows } from '../data/workflows';
import type { Workflow } from '../types';
import { WorkflowEditor } from '../components/WorkflowEditor';

export const WorkflowPage: React.FC = () => {
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow>(mockWorkflows[0]);

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            <Card className="w-1/3 h-full flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4">Templates de Workflow</h2>
                <p className="text-sm text-slate-400 mb-6">Selecione um template para visualizar a automação.</p>
                <div className="space-y-2 overflow-y-auto">
                    {mockWorkflows.map(wf => (
                        <button 
                            key={wf.id}
                            onClick={() => setSelectedWorkflow(wf)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedWorkflow.id === wf.id ? 'bg-indigo-600/30 border-indigo-500' : 'bg-slate-800/50 hover:bg-slate-700/50 border-transparent'} border`}
                        >
                            <p className="font-semibold text-slate-200">{wf.name}</p>
                            <p className="text-xs text-slate-400 mt-1">{wf.description}</p>
                        </button>
                    ))}
                </div>
            </Card>
            <Card className="w-2/3 h-full overflow-y-auto">
                <WorkflowEditor workflow={selectedWorkflow} />
            </Card>
        </div>
    );
};
