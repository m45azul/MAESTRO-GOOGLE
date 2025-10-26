import { Workflow } from '../types';

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Onboarding de Cliente',
    description: 'Automação completa desde a assinatura do contrato até o início do trabalho jurídico.',
    nodes: [
      { id: 'n1-1', type: 'trigger', title: 'Contrato Assinado', description: 'Iniciado quando um contrato é assinado no CRM.', module: 'CRM', iconName: 'Contract' },
      { id: 'n1-2', type: 'action', title: 'Criar Processo Jurídico', description: 'Cria um novo registro no módulo Jurídico.', module: 'Jurídico', iconName: 'Legal' },
      { id: 'n1-3', type: 'action', title: 'Criar Item na Carteira (Advogado)', description: 'Adiciona o valor dos honorários na carteira do advogado.', module: 'Financeiro', iconName: 'Wallet' },
      { id: 'n1-4', type: 'action', title: 'Criar Item na Carteira (SDR)', description: 'Adiciona a comissão pela conversão na carteira do SDR.', module: 'Financeiro', iconName: 'Wallet' },
      { id: 'n1-5', type: 'action', title: 'Enviar Email de Boas-Vindas', description: 'Envia comunicação inicial para o novo cliente.', module: 'Atendimento', iconName: 'Message' },
      { id: 'n1-6', type: 'action', title: 'Agendar Reunião de Kick-off', description: 'Cria um evento na agenda para 7 dias após a conversão.', module: 'Agenda', iconName: 'Calendar' },
      { id: 'n1-7', type: 'action', title: 'Criar Tarefa "Preparar Estratégia"', description: 'Atribui uma tarefa inicial para o advogado responsável.', module: 'Jurídico', iconName: 'Task' },
    ]
  },
  {
    id: 'wf-2',
    name: 'Aprovação de Despesa',
    description: 'Fluxo para aprovação de despesas processuais com base em alçadas de valores.',
    nodes: [
      { id: 'n2-1', type: 'trigger', title: 'Nova Despesa Criada', description: 'Iniciado quando uma despesa é solicitada no sistema.', module: 'Financeiro', iconName: 'Finance' },
      { id: 'n2-2', type: 'condition', title: 'Valor < R$ 5.000?', description: 'Verifica se o valor está dentro da alçada de aprovação automática.', module: 'Sistema', iconName: 'Finance', condition: { if: 'Sim', thenId: 'n2-3', elseId: 'n2-4' } },
      { id: 'n2-3', type: 'action', title: 'Aprovar Automaticamente', description: 'Despesa aprovada sem necessidade de revisão.', module: 'Sistema', iconName: 'Task' },
      { id: 'n2-4', type: 'condition', title: 'Valor < R$ 15.000?', description: 'Verifica se o valor está na alçada do Controller.', module: 'Sistema', iconName: 'Finance', condition: { if: 'Sim', thenId: 'n2-5', elseId: 'n2-6' } },
      { id: 'n2-5', type: 'action', title: 'Solicitar Aprovação do Controller', description: 'Cria uma tarefa de aprovação para o Controller da área.', module: 'Jurídico', iconName: 'Task' },
      { id: 'n2-6', type: 'action', title: 'Solicitar Aprovação do MAESTRO', description: 'Cria uma tarefa de aprovação para o MAESTRO.', module: 'Sistema', iconName: 'Task' },
    ]
  }
];
