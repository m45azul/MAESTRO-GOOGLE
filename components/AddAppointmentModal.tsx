import React, { useState, useEffect } from 'react';
import { Appointment, User, LegalCase } from '../types.ts';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'> | Appointment) => Promise<void>;
  appointment: Appointment | null;
  selectedDate: Date;
  allUsers: User[];
  cases: LegalCase[];
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, onSave, appointment, selectedDate, allUsers, cases }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<Appointment['type']>('Reunião');
  const [description, setDescription] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [caseId, setCaseId] = useState<string | undefined>(undefined);
  
  const isEditing = !!appointment;

  useEffect(() => {
    if (isOpen) {
        if(appointment) {
            setTitle(appointment.title);
            setTime(appointment.time);
            setType(appointment.type);
            setDescription(appointment.description || '');
            setParticipantIds(appointment.participantIds);
            setCaseId(appointment.caseId);
        } else {
            setTitle('');
            setTime('09:00');
            setType('Reunião');
            setDescription('');
            setParticipantIds([]);
            setCaseId(undefined);
        }
    }
  }, [appointment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentData = {
      title,
      time,
      type,
      date: appointment ? appointment.date : selectedDate.toISOString().split('T')[0],
      description,
      participantIds,
      caseId,
    };

    if (isEditing && appointment) {
        await onSave({ ...appointment, ...appointmentData });
    } else {
        await onSave(appointmentData);
    }
    
    onClose();
  };

  const handleParticipantToggle = (userId: string) => {
      setParticipantIds(prev => 
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
      );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">{isEditing ? 'Editar Compromisso' : `Novo Compromisso para ${selectedDate.toLocaleDateString('pt-BR')}`}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">Título</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-300">Horário</label>
                <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-300">Tipo</label>
                <select id="type" value={type} onChange={e => setType(e.target.value as Appointment['type'])} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                  <option>Reunião</option>
                  <option>Audiência</option>
                  <option>Prazo Processual</option>
                  <option>Follow-up</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="caseId" className="block text-sm font-medium text-slate-300">Processo Vinculado (Opcional)</label>
              <select id="caseId" value={caseId || ''} onChange={e => setCaseId(e.target.value || undefined)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                <option value="">Nenhum</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300">Participantes</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-700/50 rounded-lg">
                    {allUsers.map(user => (
                        <label key={user.id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-600">
                            <input type="checkbox" checked={participantIds.includes(user.id)} onChange={() => handleParticipantToggle(user.id)} className="h-4 w-4 rounded bg-slate-600 border-slate-500 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm text-slate-200">{user.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">Descrição (Opcional)</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};