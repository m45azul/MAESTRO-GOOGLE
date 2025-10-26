
import React from 'react';
import type { User, Task } from '../types';
import { MaestroDashboard } from './dashboards/MaestroDashboard';
import { SdrDashboard } from './dashboards/SdrDashboard';
import { AdvogadoDashboard } from './dashboards/AdvogadoDashboard';
import { ControllerDashboard } from './dashboards/ControllerDashboard';
import { SocioDashboard } from './dashboards/SocioDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { AdvogadoParceiroDashboard } from './dashboards/AdvogadoParceiroDashboard';
import { OperadorDashboard } from './dashboards/OperadorDashboard';
import { ParceiroDashboard } from './dashboards/ParceiroDashboard';


interface DashboardProps {
    user: User;
    tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, tasks }) => {
  switch(user.role) {
    case 'MAESTRO':
      return <MaestroDashboard tasks={tasks} />;
    case 'Sócio':
      return <SocioDashboard user={user} />;
    case 'Controller':
      return <ControllerDashboard />;
    case 'Advogado Interno':
      return <AdvogadoDashboard user={user} tasks={tasks} />;
    case 'Advogado Parceiro':
        return <AdvogadoParceiroDashboard user={user} />;
    case 'SDR':
      return <SdrDashboard user={user} tasks={tasks} />;
    case 'Administrativo':
        return <AdminDashboard user={user} />;
    case 'Operador de Atendimento':
        return <OperadorDashboard user={user} />;
    case 'Parceiro Indicador':
    case 'Parceiro SDR':
    case 'Parceiro Outros':
        return <ParceiroDashboard user={user} />;
    default:
      return <MaestroDashboard tasks={tasks} />; // Default dashboard
  }
};
