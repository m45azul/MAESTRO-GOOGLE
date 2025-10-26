import React, { useState, useMemo } from 'react';
import { Calendar } from '../components/Calendar';
import { AppointmentList } from '../components/AppointmentList';
// FIX: Import Task type to be used in the component props.
import type { Appointment, User, Task } from '../types';
import { PlusIcon } from '../components/icons';
import { AddAppointmentModal } from '../components/AddAppointmentModal';
import { Card } from '../components/Card';

// FIX: Added a new component to display tasks for the selected day.
const priorityStyles = {
    'Crítica': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Alta': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Média': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
    <div className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center border border-slate-700/50">
        <div>
            <p className="font-medium text-slate-200">{task.title}</p>
            <p className="text-xs text-slate-400">{task.type}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
            {task.priority}
        </span>
    </div>
);

const TaskListForDay: React.FC<{ tasks: Task[]; selectedDate: Date }> = ({ tasks, selectedDate }) => {
  return (
    <Card className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">
        Tarefas - {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
      </h3>
      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Nenhuma tarefa para este dia.</p>
          </div>
        )}
      </div>
    </Card>
  );
};


interface AgendaPageProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  allUsers: User[];
  // FIX: Added the 'tasks' prop to fix the TypeScript error in App.tsx.
  tasks: Task[];
}

export const AgendaPage: React.FC<AgendaPageProps> = ({ appointments, setAppointments, allUsers, tasks }) => {
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
  
  // FIX: Added a memoized selector to filter tasks for the selected day.
  const tasksForSelectedDay = useMemo(() => {
    return tasks.filter(task => {
        if (!task.dueDate || task.dueDate === 'N/A') return false;
        try {
            const [day, month, year] = task.dueDate.split('/').map(Number);
            // JavaScript's Date month is 0-indexed, so we subtract 1.
            const taskDate = new Date(year, month - 1, day);
            return taskDate.toDateString() === selectedDate.toDateString();
        } catch (e) {
            console.error("Error parsing task due date:", task.dueDate, e);
            return false;
        }
    });
  }, [selectedDate, tasks]);
  
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
      {/* FIX: Updated layout to show both appointments and tasks lists on the right column. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        <div className="lg:col-span-2">
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            eventDays={eventDays}
            initialDate={new Date(2025, 9, 1)}
          />
        </div>
        <div className="flex flex-col gap-8 min-h-0">
            <div className="flex-1 min-h-0">
                 <AppointmentList 
                    selectedDate={selectedDate} 
                    appointments={appointmentsForSelectedDay}
                    onEdit={openEditModal}
                    onDelete={handleDeleteAppointment}
                />
            </div>
            <div className="flex-1 min-h-0">
                <TaskListForDay tasks={tasksForSelectedDay} selectedDate={selectedDate} />
            </div>
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