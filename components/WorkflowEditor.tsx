

import React from 'react';
import { Workflow } from '../types.ts';
import { WorkflowNode } from './WorkflowNode.tsx';

const Connector: React.FC = () => (
    <div className="h-8 w-px bg-slate-600 mx-auto" />
);

const BranchContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`flex flex-col items-center w-full relative border border-slate-700/50 p-4 rounded-lg space-y-4 ${className}`}>
        {children}
    </div>
);

const BranchLabel: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-slate-400 bg-slate-800 px-2 z-10">
        {text}
    </div>
);

export const WorkflowEditor: React.FC<{ workflow: Workflow }> = ({ workflow }) => {
    
    const nodeMap = React.useMemo(() => new Map(workflow.nodes.map(node => [node.id, node])), [workflow.nodes]);

    const renderLinearWorkflow = () => {
        return workflow.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
                <WorkflowNode node={node} />
                {index < workflow.nodes.length - 1 && <Connector />}
            </React.Fragment>
        ));
    };

    const renderBranchedWorkflow = () => {
        const n1 = nodeMap.get('n2-1');
        const n2 = nodeMap.get('n2-2');
        const n3 = nodeMap.get('n2-3'); // then for n2
        const n4 = nodeMap.get('n2-4'); // else for n2
        const n5 = nodeMap.get('n2-5'); // then for n4
        const n6 = nodeMap.get('n2-6'); // else for n4

        if (!n1 || !n2 || !n3 || !n4 || !n5 || !n6) {
            return <p>Os dados do fluxo de trabalho estão incompletos.</p>;
        }

        return (
            <>
                <WorkflowNode node={n1} />
                <Connector />
                <WorkflowNode node={n2} />
                <Connector />
                <div className="flex w-full justify-around items-stretch gap-4 self-stretch">
                    {/* Branch for n2 -> then */}
                    <BranchContainer className="w-1/2">
                        <BranchLabel text="SE SIM (< R$5k)" />
                        <WorkflowNode node={n3} />
                    </BranchContainer>

                    {/* Branch for n2 -> else */}
                    <BranchContainer className="w-1/2">
                        <BranchLabel text="SE NÃO" />
                        <WorkflowNode node={n4} />
                        <Connector />
                        <div className="flex w-full justify-around items-stretch gap-2 self-stretch">
                            {/* Branch for n4 -> then */}
                            <BranchContainer>
                                <BranchLabel text="SE SIM (< R$15k)" />
                                <WorkflowNode node={n5} />
                            </BranchContainer>
                            {/* Branch for n4 -> else */}
                            <BranchContainer>
                                <BranchLabel text="SE NÃO" />
                                <WorkflowNode node={n6} />
                            </BranchContainer>
                        </div>
                    </BranchContainer>
                </div>
            </>
        )
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-2">{workflow.name}</h2>
            <p className="text-sm text-slate-400 mb-8">{workflow.description}</p>
            <div className="flex flex-col items-center">
                {workflow.id === 'wf-2' ? renderBranchedWorkflow() : renderLinearWorkflow()}
            </div>
        </div>
    );
};