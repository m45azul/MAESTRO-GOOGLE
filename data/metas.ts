import { Meta } from '../types';

export const mockMetas: Meta[] = [
    { id: 'meta-1', title: 'Conversões de Leads (SDR)', type: 'Quantitativa', target: 10, current: 8, period: 'Mensal', assigneeId: 'user-sdr-1' },
    { id: 'meta-2', title: 'Faturamento da Equipe', type: 'Financeira', target: 250000, current: 215000, period: 'Mensal', assigneeId: 'team-legal' },
    { id: 'meta-3', title: 'Taxa de Sucesso em Casos', type: 'Qualitativa', target: 90, current: 92, period: 'Trimestral', assigneeId: 'user-adv-2' },
    { id: 'meta-4', title: 'Horas Faturáveis', type: 'Quantitativa', target: 120, current: 95, period: 'Mensal', assigneeId: 'user-adv-1' },
];

export const mockRanking = [
    { userId: 'user-adv-1', name: 'Dr. Carlos Andrade', metric: 'Processos Ganhos', value: 8, rank: 1 },
    { userId: 'user-adv-2', name: 'Dra. Beatriz Lima', metric: 'Processos Ganhos', value: 6, rank: 2 },
    { userId: 'user-controller', name: 'Dr. Ricardo Neves', metric: 'Processos Ganhos', value: 5, rank: 3 },
];
