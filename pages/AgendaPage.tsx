import React, { useState, useMemo } from 'react';
import { Calendar } from '../components/Calendar';
import { AppointmentList } from '../components/AppointmentList';
import type { Appointment, User } from '../types';
import { PlusIcon } from '../components/icons';
import { AddAppointmentModal } from '../components/AddAppointmentModal';

interface AgendaPageProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  allUsers: User[];
}

export const AgendaPage: React.FC<AgendaPageProps> = ({ appointments, setAppointments, allUsers }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 26));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const eventDays = useMemo(() => {
    const dates = new Set<string>();
    appointments.forEach(app => dates.add(app.date));
    return Array.from(dates);
  }, [appointments]);

  const appointmentsForSelectedDay = useMemo(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    return appointments
      .filter(app => app.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, appointments]);
  
  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'> | Appointment) => {
    if ('id' in appointmentData) { // Editing
        setAppointments(prev => prev.map(a => a.id === appointmentData.id ? appointmentData : a));
    } else { // Creating
        setAppointments(prev => [...prev, { ...appointmentData, id: `app-${Date.now()}` }]);
    }
  };

  const handleDeleteAppointment = (appointmentId: string) => {
      if (window.confirm("Tem certeza que deseja excluir este compromisso?")) {
          setAppointments(prev => prev.filter(a => a.id !== appointmentId));
      }
  };

  const openAddModal = () => {
      setEditingAppointment(null);
      setIsModalOpen(true);
  };
  
  const openEditModal = (appointment: Appointment) => {
      setEditingAppointment(appointment);
      setIsModalOpen(true);
  };


  return (
    <>
      <div className="flex justify-end mb-6">
        <button
            onClick={openAddModal}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
            <PlusIcon className="w-5 h-5 mr-2"/>
            Novo Compromisso
        </button>
      </div>
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
            onEdit={openEditModal}
            onDelete={handleDeleteAppointment}
          />
        </div>
      </div>
      {isModalOpen && (
        <AddAppointmentModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveAppointment}
            appointment={editingAppointment}
            selectedDate={selectedDate}
            allUsers={allUsers}
        />
      )}
    </>
  );
};