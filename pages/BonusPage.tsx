
import React from 'react';
import { Card } from '../components/Card.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Meta, RankingItem, User } from '../types.ts';
import { AwardIcon } from '../components/icons.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

interface GoalCardProps {
    meta: Meta;
    users: User[];
}

const GoalCard: React.FC<GoalCardProps> = ({ meta, users }) => {
    const progress = Math.min((meta.current / meta.target) * 100, 100);
    const assignee = users.find(u => u.id === meta.assigneeId);
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

interface PerformanceRankingProps {
    ranking: RankingItem[];
    users: User[];
}

const PerformanceRanking: React.FC<PerformanceRankingProps> = ({ ranking, users }) => {
    const userMap = new Map<string, User>(users.map(u => [u.id, u]));
    return (
        <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Ranking de Performance (Mês)</h3>
            <div className="space-y-3">
                {ranking.map(item => (
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
    const { data, isLoading } = useApi();
    const { metas = [], ranking = [], users = [] } = data || {};

    if (!user) return null;
    
    const myMetas = metas.filter(m => m.assigneeId === user.id);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <SkeletonLoader className="h-10 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <SkeletonLoader key={i} className="h-32" />)}
                </div>
                 <SkeletonLoader className="h-64" />
            </div>
        );
    }

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
                        {myMetas.map(meta => <GoalCard key={meta.id} meta={meta} users={users} />)}
                    </div>
                </div>
            )}

            <div>
                 <h2 className="text-xl font-semibold text-white mb-4">Metas da Equipe</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metas.filter(m => m.assigneeId === 'team-legal').map(meta => <GoalCard key={meta.id} meta={meta} users={users} />)}
                </div>
            </div>

            <div>
                <PerformanceRanking ranking={ranking} users={users} />
            </div>

        </div>
    );
};
