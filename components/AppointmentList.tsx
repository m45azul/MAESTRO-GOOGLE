import React from 'react';
import type { Appointment } from '../types';
import { Card } from './Card';
import { MeetingIcon, HearingIcon, DeadlineIcon, FollowUpIcon } from './icons';

interface AppointmentListProps {
  selectedDate: Date;
  appointments: Appointment[];
}

const AppointmentTypeIcon: React.FC<{ type: Appointment['type'] }> = ({ type }) => {
  const styles = "w-5 h-5 mr-3";
  switch (type) {
    case 'Reunião':
      return <MeetingIcon className={`${styles} text-sky-400`} />;
    case 'Audiência':
      return <HearingIcon className={`${styles} text-red-400`} />;
    case 'Prazo Processual':
      return <DeadlineIcon className={`${styles} text-amber-400`} />;
    case 'Follow-up':
        return <FollowUpIcon className={`${styles} text-green-400`} />;
    default:
      return null;
  }
};

export const AppointmentList: React.FC<AppointmentListProps> = ({ selectedDate, appointments }) => {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Compromissos - {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
      </h3>
      <div className="space-y-4 overflow-y-auto h-[calc(100%-40px)] pr-2">
        {appointments.length > 0 ? (
          appointments.map(app => (
            <div key={app.id} className="flex items-start p-3 bg-slate-800/50 rounded-lg">
              <AppointmentTypeIcon type={app.type} />
              <div>
                <p className="font-medium text-slate-200">{app.title}</p>
                <p className="text-sm text-slate-400">{app.time} - {app.type}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Nenhum compromisso para este dia.</p>
          </div>
        )}
      </div>
    </Card>
  );
};