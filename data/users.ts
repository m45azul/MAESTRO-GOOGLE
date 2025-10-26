import { User } from '../types';

export const mockUsers: User[] = [
    { id: 'user-1', name: 'Dr. Carlos Andrade', email: 'carlos@maestro.law', role: 'Advogado Interno', avatarUrl: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 'user-2', name: 'Dra. Beatriz Lima', email: 'beatriz@maestro.law', role: 'Advogado Interno', avatarUrl: 'https://i.pravatar.cc/150?u=beatriz' },
    { id: 'user-3', name: 'Dr. Ricardo Neves', email: 'ricardo@maestro.law', role: 'Controller', avatarUrl: 'https://i.pravatar.cc/150?u=ricardo' },
    { id: 'user-4', name: 'Dra. Juliana Costa', email: 'juliana@maestro.law', role: 'SDR', avatarUrl: 'https://i.pravatar.cc/150?u=juliana' },
    { id: 'user-5', name: 'Sócio Fundador', email: 'maestro@maestro.law', role: 'MAESTRO', avatarUrl: 'https://i.pravatar.cc/150?u=maestro' },
    { id: 'user-6', name: 'João SDR', email: 'joao.sdr@maestro.law', role: 'SDR', avatarUrl: 'https://i.pravatar.cc/150?u=joao' },
];

export const userMap = new Map(mockUsers.map(user => [user.id, user]));
