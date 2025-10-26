import React, { useState } from 'react';
import { Card } from './Card';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  eventDays: string[];
  initialDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, eventDays, initialDate }) => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const today = new Date();

  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-700 transition-colors">&lt;</button>
        <h2 className="text-lg font-semibold text-white">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-700 transition-colors">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          const hasEvent = eventDays.includes(date.toISOString().split('T')[0]);

          return (
            <div
              key={index}
              className={`flex items-center justify-center h-full rounded-lg cursor-pointer transition-colors
                ${isCurrentMonth ? 'text-slate-200' : 'text-slate-600'}
                ${isSelected ? 'bg-indigo-600 text-white font-bold' : ''}
                ${!isSelected && isToday ? 'bg-slate-700/50' : ''}
                ${!isSelected ? 'hover:bg-slate-700' : ''}
              `}
              onClick={() => onDateSelect(date)}
            >
              <span className="relative">
                {date.getDate()}
                {hasEvent && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"></span>}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};