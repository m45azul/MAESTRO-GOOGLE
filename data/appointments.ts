import type { Appointment } from '../types';

export const mockAppointments: Appointment[] = [
  { id: '1', date: '2025-10-26', time: '09:00', title: 'Reunião Kick-off - Cliente Global Tech', type: 'Reunião', participantIds: ['user-adv-1', 'user-controller', 'user-maestro'], description: 'Alinhamento inicial com o cliente sobre o caso.' },
  { id: '2', date: '2025-10-26', time: '14:00', title: 'Audiência Processo 2025-001', type: 'Audiência', participantIds: ['user-adv-1'], description: 'Audiência de conciliação na 3ª Vara do Trabalho.' },
  { id: '3', date: '2025-10-28', time: '18:00', title: 'Prazo final - Contestação Proc. 2025-157', type: 'Prazo Processual', participantIds: ['user-adv-2'] },
  { id: '4', date: '2025-11-05', time: '11:00', title: 'Follow-up com Varejo Ponto Certo', type: 'Follow-up', participantIds: ['user-sdr-1'] },
  { id: '5', date: '2025-11-05', time: '15:30', title: 'Reunião de alinhamento com Dr. Carlos', type: 'Reunião', participantIds: ['user-controller', 'user-adv-1'] },
  { id: '6', date: '2025-10-26', time: '16:00', title: 'Follow-up com lead "Inovações em Saúde"', type: 'Follow-up', participantIds: ['user-sdr-1']},
];