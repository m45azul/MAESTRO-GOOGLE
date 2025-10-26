import React, { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { AppointmentList } from '../components/AppointmentList';
import type { Appointment } from '../types';

const mockAppointments: Appointment[] = [
  { id: '1', date: '2025-10-26', time: '09:00', title: 'Reunião Kick-off - Cliente Global Tech', type: 'Reunião' },
  { id: '2', date: '2025-10-26', time: '14:00', title: 'Audiência Processo 2025-001', type: 'Audiência' },
  { id: '3', date: '2025-10-28', time: '18:00', title: 'Prazo final - Contestação Proc. 2025-157', type: 'Prazo Processual' },
  { id: '4', date: '2025-11-05', time: '11:00', title: 'Follow-up com Varejo Ponto Certo', type: 'Follow-up' },
  { id: '5', date: '2025-11-05', time: '15:30', title: 'Reunião de alinhamento com Dr. Carlos', type: 'Reunião' },
  { id: '6', date: '2025-10-26', time: '16:00', title: 'Follow-up com lead "Inovações em Saúde"', type: 'Follow-up'},
];

export const AgendaPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 26));

  const eventDays = React.useMemo(() => {
    const dates = new Set<string>();
    mockAppointments.forEach(app => dates.add(app.date));
    return Array.from(dates);
  }, []);

  const appointmentsForSelectedDay = React.useMemo(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    return mockAppointments
      .filter(app => app.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2">
        <Calendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          eventDays={eventDays}
          initialDate={new Date(2025, 9, 1)}
        />
      </div>
      <div>
        <AppointmentList 
          selectedDate={selectedDate} 
          appointments={appointmentsForSelectedDay}
        />
      </div>
    </div>
  );
};