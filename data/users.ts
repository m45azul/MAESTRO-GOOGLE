import { User } from '../types';

export const mockUsers: User[] = [
    { id: 'user-maestro', name: 'Maestro Supremo', email: 'maestro@maestro.law', role: 'MAESTRO', avatarUrl: 'https://i.pravatar.cc/150?u=maestro', cpf: '111.111.111-11', phone: '(11) 99999-0001', status: 'Ativo' },
    { id: 'user-socio', name: 'Dr. Fernando Alves', email: 'fernando@maestro.law', role: 'Sócio', avatarUrl: 'https://i.pravatar.cc/150?u=fernando', cpf: '222.222.222-22', phone: '(11) 99999-0002', status: 'Ativo' },
    { id: 'user-controller', name: 'Dr. Ricardo Neves', email: 'ricardo@maestro.law', role: 'Controller', avatarUrl: 'https://i.pravatar.cc/150?u=ricardo', cpf: '333.333.333-33', phone: '(11) 99999-0003', oabNumber: 'SP12345', status: 'Ativo', valorHora: 350 },
    { id: 'user-adv-1', name: 'Dr. Carlos Andrade', email: 'carlos@maestro.law', role: 'Advogado Interno', avatarUrl: 'https://i.pravatar.cc/150?u=carlos', cpf: '444.444.444-44', phone: '(11) 99999-0004', oabNumber: 'SP54321', funcaoComercialHabilitada: true, status: 'Ativo', valorHora: 250 },
    { id: 'user-adv-2', name: 'Dra. Beatriz Lima', email: 'beatriz@maestro.law', role: 'Advogado Interno', avatarUrl: 'https://i.pravatar.cc/150?u=beatriz', cpf: '555.555.555-55', phone: '(11) 99999-0005', oabNumber: 'SP67890', funcaoComercialHabilitada: false, status: 'Ativo', valorHora: 250 },
    { id: 'user-adv-parceiro', name: 'Dra. Sofia Rocha', email: 'sofia.parceira@external.law', role: 'Advogado Parceiro', avatarUrl: 'https://i.pravatar.cc/150?u=sofia', cpf: '666.666.666-66', phone: '(11) 99999-0006', oabNumber: 'RJ12345', status: 'Ativo', valorHora: 300 },
    { id: 'user-sdr-1', name: 'Juliana Costa', email: 'juliana@maestro.law', role: 'SDR', avatarUrl: 'https://i.pravatar.cc/150?u=juliana', cpf: '777.777.777-77', phone: '(11) 99999-0007', status: 'Ativo' },
    { id: 'user-sdr-2', name: 'João SDR', email: 'joao.sdr@maestro.law', role: 'SDR', avatarUrl: 'https://i.pravatar.cc/150?u=joao', cpf: '888.888.888-88', phone: '(11) 99999-0008', status: 'Inativo' },
    { id: 'user-admin', name: 'Roberto Silva', email: 'roberto.admin@maestro.law', role: 'Administrativo', avatarUrl: 'https://i.pravatar.cc/150?u=roberto', cpf: '999.999.999-99', phone: '(11) 99999-0009', status: 'Ativo' },
    { id: 'user-atendimento', name: 'Camila Dias', email: 'camila.atendimento@maestro.law', role: 'Operador de Atendimento', avatarUrl: 'https://i.pravatar.cc/150?u=camila', cpf: '101.010.101-01', phone: '(11) 99999-0010', status: 'Ativo' },
    { id: 'user-parceiro-ind', name: 'Contabilidade ABC', email: 'contato@contabilidadeabc.com', role: 'Parceiro Indicador', avatarUrl: 'https://i.pravatar.cc/150?u=contador', status: 'Ativo' },
    { id: 'user-parceiro-sdr', name: 'Vendas Pro', email: 'contato@vendaspro.com', role: 'Parceiro SDR', avatarUrl: 'https://i.pravatar.cc/150?u=vendassdr', status: 'Ativo' },
    { id: 'user-parceiro-outro', name: 'Perícia Técnica XYZ', email: 'contato@periciaxyz.com', role: 'Parceiro Outros', avatarUrl: 'https://i.pravatar.cc/150?u=pericia', status: 'Inativo' },
];

export const userMap = new Map(mockUsers.map(user => [user.id, user]));