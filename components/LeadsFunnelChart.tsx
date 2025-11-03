import React, { useMemo } from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, Tooltip, LabelList, Cell } from 'recharts';
import { Card } from './Card.tsx';
import { Lead, PipelineStage } from '../types.ts';

interface LeadsFunnelChartProps {
  leads: Lead[];
  stages: PipelineStage[];
}

const COLORS = ['#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#312e81'];

export const LeadsFunnelChart: React.FC<LeadsFunnelChartProps> = ({ leads, stages }) => {
  const funnelData = useMemo(() => {
    let previousCount = leads.length > 0 ? leads.filter(l => l.stage === stages[0]).length : 0;
    
    return stages.map((stage, index) => {
      const leadsInStage = leads.filter(l => l.stage === stage);
      const count = leadsInStage.length;
      const value = leadsInStage.reduce((sum, lead) => sum + lead.value, 0);
      
      let conversion = 100;
      if (index > 0) {
        conversion = previousCount > 0 ? (count / previousCount) * 100 : 0;
      }
      
      previousCount = count;

      return {
        name: stage,
        count,
        value,
        conversion,
        fill: COLORS[index % COLORS.length],
      };
    }).filter(data => data.count > 0);
  }, [leads, stages]);

  if (leads.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <p className="text-slate-500">Nenhum lead encontrado para os filtros selecionados.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Funil de Vendas por Estágio</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <FunnelChart>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '0.5rem' 
              }} 
              formatter={(value: number, name: string) => {
                  if (name === 'value') return `R$ ${value.toLocaleString('pt-BR')}`;
                  if (name === 'conversion') return `${value.toFixed(1)}%`;
                  return value;
              }}
              labelStyle={{ color: '#cbd5e1' }}
              itemStyle={{ color: '#a5b4fc' }}
              wrapperClassName="text-sm"
            />
            <Funnel
              dataKey="count"
              data={funnelData}
              isAnimationActive
            >
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList 
                position="center" 
                fill="#fff" 
                stroke="none" 
                dataKey="name" 
                formatter={(value: string, entry: any) => `${value} (${entry.payload.count})`}
                className="font-semibold"
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};