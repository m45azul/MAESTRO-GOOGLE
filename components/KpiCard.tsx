
import React from 'react';
import { Card } from './Card.tsx';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  isNegative?: boolean;
}

const ArrowUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>;
const ArrowDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;


export const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, isNegative = false }) => {
  const changeColor = isNegative ? 'text-red-400' : 'text-green-400';

  return (
    <Card>
      <div className="flex flex-col h-full">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="mt-2 flex-grow flex items-end justify-between">
            <p className="text-3xl font-bold text-white">{value}</p>
            <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
                {isNegative ? <ArrowDown /> : <ArrowUp />}
                <span className="ml-1">{change}</span>
            </div>
        </div>
      </div>
    </Card>
  );
};