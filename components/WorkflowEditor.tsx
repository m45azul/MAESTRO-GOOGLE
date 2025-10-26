import React from 'react';
import type { Workflow, WorkflowNode as WorkflowNodeType } from '../types';
import { WorkflowNode } from './WorkflowNode';

const Connector: React.FC = () => (
    <div className="h-8 w-px bg-slate-600 mx-auto" />
);

const ConditionalConnector: React.FC = () => (
    <div className="h-12 w-px bg-slate-600 mx-auto relative">
        <div className="absolute top-1/2 -left-20 w-20 border-t border-slate-600">
            <span className="absolute -top-2.5 left-2 text-xs text-slate-400 bg-slate-800 px-1">Sim</span>
        </div>
        <div className="absolute top-1/2 left-0 w-20 border-t border-slate-600">
             <span className="absolute -top-2.5 right-2 text-xs text-slate-400 bg-slate-800 px-1">Não</span>
        </div>
    </div>
)

export const WorkflowEditor: React.FC<{ workflow: Workflow }> = ({ workflow }) => {
    
    const renderNode = (node: WorkflowNodeType, index: number) => {
        const nextNode = workflow.nodes[index + 1];
        
        if (node.type === 'condition' && node.condition) {
            const thenNode = workflow.nodes.find(n => n.id === node.condition?.thenId);
            const elseNode = workflow.nodes.find(n => n.id === node.condition?.elseId);

            return (
                 <div key={node.id} className="flex flex-col items-center">
                    <WorkflowNode node={node} />
                    <div className="h-8 w-px bg-slate-600 mx-auto" />
                    <div className="flex w-full justify-around">
                        <div className="flex flex-col items-center w-1/2 relative">
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-slate-400 bg-slate-800 px-2 z-10">SE SIM</div>
                             <div className="w-px h-6 bg-slate-600" />
                            {thenNode && <WorkflowNode node={thenNode} />}
                        </div>
                         <div className="flex flex-col items-center w-1/2 relative">
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-slate-400 bg-slate-800 px-2 z-10">SE NÃO</div>
                             <div className="w-px h-6 bg-slate-600" />
                            {elseNode && (
                                <>
                                 <WorkflowNode node={elseNode} />
                                 <Connector/>
                                 <WorkflowNode node={workflow.nodes.find(n => n.id === 'n2-5')!} />
                                  <Connector/>
                                 <WorkflowNode node={workflow.nodes.find(n => n.id === 'n2-6')!} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )
        }
        
        // Simple flow rendering
        if(workflow.id === 'wf-1') {
            return(
                <div key={node.id} className="flex flex-col items-center">
                    <WorkflowNode node={node} />
                    {nextNode && <Connector />}
                </div>
            )
        }

        return null;
    };

    const renderWf2 = () => (
         <div className="flex flex-col items-center">
             <WorkflowNode node={workflow.nodes.find(n => n.id === 'n2-1')!} />
             <Connector/>
             <WorkflowNode node={workflow.nodes.find(n => n.id === 'n2-2')!} />
             <div className="h-8 w-full flex justify-center items-center">
                <div className="w-1/2 border-t border-slate-600 relative"><span className="absolute -top-2.5 left-2 text-xs text-slate-400 bg-slate-800 px-1">Sim</span></div>
                <div className="w-1/2 border-t border-slate-600 relative"><span className="absolute -top-2.5 right-2 text-xs text-slate-400 bg-slate-800 px-1">Não</span></div>
             </div>
             <div className="flex w-full">
                <div className="w-1/2 flex flex-col items-center">
                    <div className="w-px h-4 bg-slate-600"/>
                    <WorkflowNode node={workflow.nodes.find(n => n.id === 'n2-3')!} />
                </div>
                <div className="w-1/2 flex flex-col items-center">
                    <div className="w-px h-4 bg-slate-600"/>
                    <WorkflowNode node={workflow.nodes.find(n => n.id === 'n2-4')!} />
                     <div className="h-8 w-full flex justify-center items-center">
                        <div className="w-1/2 border-t border-slate-600 relative"><span className="absolute -top-2.5 left-2 text-xs text-slate-400 bg-slate-800 px-1">Sim</span></div>
                        <div className="w-1/2 border-t border-slate-600 relative"><span className="absolute -top-2.5 right-2 text-xs text-slate-400 bg-slate-800 px-1">Não</span></div>
                     </div>
                     <div className="flex w-full">
                        <div className="w-1/2 flex flex-col items-center">
                            <div className="w-px h-4 bg-slate-600"/>
                            <WorkflowNode node={workflow.nodes.find(n => n.id === 'n2-5')!} />
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                             <div className="w-px h-4 bg-slate-600"/>
                            <WorkflowNode node={workflow.nodes.find(n => n.id === 'n2-6')!} />
                        </div>
                    </div>
                </div>
             </div>
         </div>
    )

    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-2">{workflow.name}</h3>
            <p className="text-sm text-slate-400 mb-8">{workflow.description}</p>
            <div className="px-4">
                {workflow.id === 'wf-1' && workflow.nodes.map((node, index) => renderNode(node, index))}
                {workflow.id === 'wf-2' && renderWf2()}
            </div>
        </div>
    );
};
