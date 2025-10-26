import React, { useState } from 'react';
import { LegalCase, TimeLog, User } from '../types';
import { userMap } from '../data/users';

interface TimesheetTabProps {
    caseData: LegalCase;
    // FIX: Changed the type of 'timeLog' to Omit<TimeLog, 'id' | 'status'> to match the object being created and passed.
    onAddTimeLog: (caseId: string, timeLog: Omit<TimeLog, 'id' | 'status'>) => void;
    // FIX: Added the onUpdateTimeLogStatus prop to align with the parent component (CaseDetails.tsx).
    onUpdateTimeLogStatus: (caseId: string, timeLogId: string, status: TimeLog['status']) => void;
    currentUser: User;
}

export const TimesheetTab: React.FC<TimesheetTabProps> = ({ caseData, onAddTimeLog, currentUser, onUpdateTimeLogStatus }) => {
    const [hours, setHours] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hours && description && date) {
            onAddTimeLog(caseData.id, {
                date,
                hours: parseFloat(hours),
                description,
                userId: currentUser.id,
            });
            setHours('');
            setDescription('');
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 mb-4">
                 {caseData.timesheet.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">Nenhuma hora lançada para este processo.</div>
                 ) : (
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                            <tr>
                                <th className="px-4 py-2">Data</th>
                                <th className="px-4 py-2">Advogado</th>
                                <th className="px-4 py-2">Descrição</th>
                                <th className="px-4 py-2 text-right">Horas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {caseData.timesheet.map(log => (
                                <tr key={log.id} className="border-b border-slate-700">
                                    <td className="px-4 py-3 whitespace-nowrap">{new Date(log.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td className="px-4 py-3">{userMap.get(log.userId)?.name || 'N/A'}</td>
                                    <td className="px-4 py-3">{log.description}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{log.hours.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
            </div>
            <form onSubmit={handleSubmit} className="mt-auto pt-4 border-t border-slate-700/50">
                <h4 className="text-base font-semibold text-white mb-3">Lançar Horas</h4>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                     <div className="md:col-span-2">
                        <label htmlFor="ts-desc" className="text-xs text-slate-400">Descrição da Atividade</label>
                        <input id="ts-desc" value={description} onChange={e => setDescription(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                    <div>
                        <label htmlFor="ts-date" className="text-xs text-slate-400">Data</label>
                        <input id="ts-date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                    <div>
                        <label htmlFor="ts-hours" className="text-xs text-slate-400">Horas</label>
                        <input id="ts-hours" type="number" step="0.1" min="0.1" value={hours} onChange={e => setHours(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                </div>
                <button type="submit" className="w-full mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-50" disabled={!description || !hours || !date}>
                    Adicionar Lançamento
                </button>
            </form>
        </div>
    )
}