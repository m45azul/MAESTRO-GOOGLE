

import React, { useState, useMemo } from 'react';
import { Appointment, LegalCase } from '../types.ts';
import { Card } from './Card.tsx';
import { MeetingIcon, HearingIcon, DeadlineIcon, FollowUpIcon, MoreVerticalIcon, EditIcon, TrashIcon } from './icons.tsx';
import { userMap } from '../data/allData.ts';

interface AppointmentListProps {
  selectedDate: Date;
  appointments: Appointment[];
  cases: LegalCase[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => Promise<void>;
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

const AppointmentItem: React.FC<{ appointment: Appointment, caseItem?: LegalCase, onEdit: (appointment: Appointment) => void, onDelete: (id: string) => Promise<void> }> = ({ appointment, caseItem, onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const participants = appointment.participantIds.map(id => userMap.get(id)).filter(Boolean);

    return (
        <div className="p-3 bg-slate-800/50 rounded-lg relative">
            <div className="flex items-start">
              <AppointmentTypeIcon type={appointment.type} />
              <div className="flex-1">
                <p className="font-medium text-slate-200 pr-6">{appointment.title}</p>
                <p className="text-sm text-slate-400">{appointment.time} - {appointment.type}</p>
                {appointment.description && <p className="text-xs text-slate-500 mt-1">{appointment.description}</p>}
                {caseItem && (
                    <p className="text-xs text-indigo-400 mt-1 truncate" title={`Processo: ${caseItem.title}`}>
                        Processo: {caseItem.title}
                    </p>
                )}
                {participants.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                        {participants.map(p => p && <img key={p.id} src={p.avatarUrl} alt={p.name} title={p.name} className="w-5 h-5 rounded-full" />)}
                    </div>
                )}
              </div>
            </div>
            <div className="absolute top-2 right-2">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} onBlur={() => setTimeout(() => setIsMenuOpen(false), 100)} className="text-slate-400 hover:text-white p-1">
                    <MoreVerticalIcon className="w-4 h-4" />
                </button>
                {isMenuOpen && (
                    <div onMouseDown={e => e.stopPropagation()} className="absolute top-full right-0 mt-1 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10 w-28">
                        <button onClick={() => { onEdit(appointment); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 rounded-t-md"><EditIcon className="w-3 h-3 mr-2" /> Editar</button>
                        <button onClick={async () => { await onDelete(appointment.id); setIsMenuOpen(false); }} className="flex items-center w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-slate-700 rounded-b-md"><TrashIcon className="w-3 h-3 mr-2" /> Excluir</button>
                    </div>
                )}
            </div>
        </div>
    )
}


export const AppointmentList: React.FC<AppointmentListProps> = ({ selectedDate, appointments, cases, onEdit, onDelete }) => {
  const caseMap = useMemo(() => new Map(cases.map(c => [c.id, c])), [cases]);
  
  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Compromissos - {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
      </h3>
      <div className="space-y-3 overflow-y-auto h-[calc(100%-40px)] pr-2">
        {appointments.length > 0 ? (
          appointments.map(app => {
            const caseItem = app.caseId ? caseMap.get(app.caseId) : undefined;
            return (
              <AppointmentItem key={app.id} appointment={app} caseItem={caseItem} onEdit={onEdit} onDelete={onDelete} />
            )
          })
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Nenhum compromisso para este dia.</p>
          </div>
        )}
      </div>
    </Card>
  );
};