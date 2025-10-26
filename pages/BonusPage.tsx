import React from 'react';
import { Card } from '../components/Card';
import { mockMetas, mockRanking } from '../data/metas';
import { useAuth } from '../context/AuthContext';
import { userMap } from '../data/users';
import { Meta } from '../types';
import { AwardIcon } from '../components/icons';


const GoalCard: React.FC<{ meta: Meta }> = ({ meta }) => {
    const progress = Math.min((meta.current / meta.target) * 100, 100);
    const assignee = userMap.get(meta.assigneeId);
    return (
        <Card>
            <p className="text-sm font-medium text-slate-400">{meta.title} ({meta.period})</p>
            <p className="text-2xl font-bold text-white mt-2">
                {meta.type === 'Financeira' ? `R$ ${meta.current.toLocaleString('pt-BR')}` : meta.current}
                <span className="text-base text-slate-400"> / {meta.type === 'Financeira' ? `R$ ${meta.target.toLocaleString('pt-BR')}` : meta.target}</span>
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mt-3">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            {assignee && <p className="text-xs text-slate-500 mt-2">Responsável: {assignee.name}</p>}
        </Card>
    );
};

const PerformanceRanking: React.FC = () => {
    return (
        <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Ranking de Performance (Mês)</h3>
            <div className="space-y-3">
                {mockRanking.map(item => (
                    <div key={item.userId} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center">
                            <span className="font-bold text-lg text-slate-400 w-6">{item.rank}°</span>
                            <img src={userMap.get(item.userId)?.avatarUrl} alt={item.name} className="w-8 h-8 rounded-full ml-2"/>
                            <p className="font-medium text-slate-200 ml-3">{item.name}</p>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-indigo-300">{item.value}</p>
                             <p className="text-xs text-slate-500">{item.metric}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export const BonusPage: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;
    
    const myMetas = mockMetas.filter(m => m.assigneeId === user.id);

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-3">
                <AwardIcon className="w-8 h-8 text-amber-400" />
                <h1 className="text-2xl font-bold text-white">Bônus e Prêmios</h1>
            </div>
            
            {myMetas.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Minhas Metas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myMetas.map(meta => <GoalCard key={meta.id} meta={meta} />)}
                    </div>
                </div>
            )}

            <div>
                 <h2 className="text-xl font-semibold text-white mb-4">Metas da Equipe</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockMetas.filter(m => m.assigneeId === 'team-legal').map(meta => <GoalCard key={meta.id} meta={meta} />)}
                </div>
            </div>

            <div>
                <PerformanceRanking />
            </div>

        </div>
    );
};
