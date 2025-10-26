
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card } from './Card';

const data = [
  { name: 'Indicação Parceiro', value: 400 },
  { name: 'Google Ads', value: 300 },
  { name: 'Site Orgânico', value: 200 },
  { name: 'Outros', value: 100 },
];

const COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#f97316'];

export const LeadsByOriginChart: React.FC = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Origem dos Leads</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{fontSize: '12px'}}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
