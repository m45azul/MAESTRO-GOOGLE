
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card } from './Card.tsx';

const data = [
  { name: 'Jan', 'Margem': 28000 },
  { name: 'Fev', 'Margem': 32000 },
  { name: 'Mar', 'Margem': 29000 },
  { name: 'Abr', 'Margem': 35000 },
  { name: 'Mai', 'Margem': 38000 },
  { name: 'Jun', 'Margem': 42550 },
];

export const NetMarginChart: React.FC = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Margem Líquida Mensal</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10, right: 30, left: 0, bottom: 0,
            }}
          >
            <defs>
                <linearGradient id="colorMargem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `R$${Number(value)/1000}k`}/>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
            <Area type="monotone" dataKey="Margem" stroke="#4f46e5" fillOpacity={1} fill="url(#colorMargem)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};