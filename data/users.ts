import { User } from '../types';

export const mockUsers: User[] = [
    { id: 'user-maestro', name: 'Maestro Supremo', email: 'maestro@maestro.law', role: 'MAESTRO', avatarUrl: 'https://i.pravatar.cc/150?u=maestro' },
    { id: 'user-socio', name: 'Dr. Fernando Alves', email: 'fernando@maestro.law', role: 'Sócio', avatarUrl: 'https://i.pravatar.cc/150?u=fernando' },
    { id: 'user-controller', name: 'Dr. Ricardo Neves', email: 'ricardo@maestro.law', role: 'Controller', avatarUrl: 'https://i.pravatar.cc/150?u=ricardo' },
    { id: 'user-adv-1', name: 'Dr. Carlos Andrade', email: 'carlos@maestro.law', role: 'Advogado Interno', avatarUrl: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 'user-adv-2', name: 'Dra. Beatriz Lima', email: 'beatriz@maestro.law', role: 'Advogado Interno', avatarUrl: 'https://i.pravatar.cc/150?u=beatriz' },
    { id: 'user-adv-parceiro', name: 'Dra. Sofia Rocha', email: 'sofia.parceira@external.law', role: 'Advogado Parceiro', avatarUrl: 'https://i.pravatar.cc/150?u=sofia' },
    { id: 'user-sdr-1', name: 'Dra. Juliana Costa', email: 'juliana@maestro.law', role: 'SDR', avatarUrl: 'https://i.pravatar.cc/150?u=juliana' },
    { id: 'user-sdr-2', name: 'João SDR', email: 'joao.sdr@maestro.law', role: 'SDR', avatarUrl: 'https://i.pravatar.cc/150?u=joao' },
    { id: 'user-admin', name: 'Roberto Silva', email: 'roberto.admin@maestro.law', role: 'Administrativo', avatarUrl: 'https://i.pravatar.cc/150?u=roberto' },
    { id: 'user-atendimento', name: 'Camila Dias', email: 'camila.atendimento@maestro.law', role: 'Operador de Atendimento', avatarUrl: 'https://i.pravatar.cc/150?u=camila' },
    { id: 'user-parceiro-ind', name: 'Contabilidade ABC', email: 'contato@contabilidadeabc.com', role: 'Parceiro Indicador', avatarUrl: 'https://i.pravatar.cc/150?u=contador' },
    { id: 'user-parceiro-sdr', name: 'Vendas Pro', email: 'contato@vendaspro.com', role: 'Parceiro SDR', avatarUrl: 'https://i.pravatar.cc/150?u=vendassdr' },
    { id: 'user-parceiro-outro', name: 'Perícia Técnica XYZ', email: 'contato@periciaxyz.com', role: 'Parceiro Outros', avatarUrl: 'https://i.pravatar.cc/150?u=pericia' },
];

export const userMap = new Map(mockUsers.map(user => [user.id, user]));