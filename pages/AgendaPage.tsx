
import React, { useState, useMemo } from 'react';
import { Calendar } from '../components/Calendar.tsx';
import { AppointmentList } from '../components/AppointmentList.tsx';
import { Appointment, Task } from '../types.ts';
import { PlusIcon } from '../components/icons.tsx';
import { AddAppointmentModal } from '../components/AddAppointmentModal.tsx';
import { Card } from '../components/Card.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

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

export const AgendaPage: React.FC = () => {
  const { data, isLoading, saveAppointment, deleteAppointment } = useApi();
  const { appointments = [], users: allUsers = [], tasks = [], cases = [] } = data || {};

  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 26));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
  
  const tasksForSelectedDay = useMemo(() => {
    return tasks.filter(task => {
        if (!task.dueDate || task.dueDate === 'N/A') return false;
        try {
            const [day, month, year] = task.dueDate.split('/').map(Number);
            const taskDate = new Date(year, month - 1, day);
            return taskDate.toDateString() === selectedDate.toDateString();
        } catch (e) {
            console.error("Error parsing task due date:", task.dueDate, e);
            return false;
        }
    });
  }, [selectedDate, tasks]);
  
  const handleAction = async (action: Promise<any>) => {
      setIsProcessing(true);
      try {
          await action;
      } finally {
          setIsProcessing(false);
      }
  };

  const handleSaveAppointment = async (appointmentData: Omit<Appointment, 'id'> | Appointment) => {
    await handleAction(saveAppointment(appointmentData));
    setIsModalOpen(false);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
      if (window.confirm("Tem certeza que deseja excluir este compromisso?")) {
          await handleAction(deleteAppointment(appointmentId));
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

  if (isLoading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-2"><SkeletonLoader className="h-full" /></div>
            <div className="flex flex-col gap-8">
                <SkeletonLoader className="h-1/2" />
                <SkeletonLoader className="h-1/2" />
            </div>
        </div>
      );
  }

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full relative">
         {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/50 z-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
            </div>
        )}
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
                    cases={cases}
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
            cases={cases}
        />
      )}
    </>
  );
};
