import type { Transaction } from '../types';

export const mockTransactions: Transaction[] = [
    { id: '1', date: '2025-10-25', description: 'Honorários ref. processo PROC-2025-001', category: 'Honorários Advocatícios', value: 15000, type: 'Receita', status: 'Realizado', reconciled: true },
    { id: '2', date: '2025-10-22', description: 'Pagamento conta de luz', category: 'Infraestrutura', value: 350.00, type: 'Despesa', status: 'Realizado', reconciled: true },
    { id: '3', date: '2025-10-20', description: 'Honorários Cliente Y', category: 'Honorários Advocatícios', value: 5000, type: 'Receita', status: 'Realizado', reconciled: false },
    { id: '4', date: '2025-10-15', description: 'Adiantamento de custas processuais', category: 'Custas Processuais', value: 850.50, type: 'Despesa', status: 'Realizado', reconciled: true },
    { id: '5', date: '2025-10-31', description: 'Recebimento previsto - Contrato 2025-089', category: 'Honorários Contratuais', value: 25000, type: 'Receita', status: 'Previsto', reconciled: false },
    { id: '6', date: '2025-11-05', description: 'Pagamento Salários', category: 'Pessoal', value: 45000, type: 'Despesa', status: 'Previsto', reconciled: false },
];