

import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/geminiService.ts';
import { Card } from './Card.tsx';

interface GeminiInsightCardProps {
    kpiData: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
    </div>
);

const formatInsights = (text: string) => {
    return text.split('\n').map((line, index) => {
        if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
            return (
                <li key={index} className="flex items-start mt-2">
                    <span className="text-indigo-400 mr-3 mt-1">&#10022;</span>
                    <span>{line.replace(/[*-]\s*/, '')}</span>
                </li>
            );
        }
        return null;
    }).filter(Boolean);
};


export const GeminiInsightCard: React.FC<GeminiInsightCardProps> = ({ kpiData }) => {
    const [insights, setInsights] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchInsights = React.useCallback(async () => {
        setIsLoading(true);
        const result = await getAIInsights(kpiData);
        setInsights(result);
        setIsLoading(false);
    }, [kpiData]);

    useEffect(() => {
        fetchInsights();
    }, [fetchInsights]);

    return (
        <Card className="h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Insights da IA</h3>
                <button 
                    onClick={fetchInsights} 
                    disabled={isLoading}
                    className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Analisando...' : 'Regenerar'}
                </button>
            </div>
            <div className="text-sm text-slate-300 h-[300px] overflow-y-auto">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <ul className="space-y-2 list-none p-0">
                       {formatInsights(insights)}
                    </ul>
                )}
            </div>
        </Card>
    );
};