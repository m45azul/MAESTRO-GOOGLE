
import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from './skeletons/SkeletonLoader.tsx';
import { MaestroDashboard } from './dashboards/MaestroDashboard.tsx';
import { SdrDashboard } from './dashboards/SdrDashboard.tsx';
import { AdvogadoDashboard } from './dashboards/AdvogadoDashboard.tsx';
import { ControllerDashboard } from './dashboards/ControllerDashboard.tsx';
import { SocioDashboard } from './dashboards/SocioDashboard.tsx';
import { AdminDashboard } from './dashboards/AdminDashboard.tsx';
import { AdvogadoParceiroDashboard } from './dashboards/AdvogadoParceiroDashboard.tsx';
import { OperadorDashboard } from './dashboards/OperadorDashboard.tsx';
import { ParceiroDashboard } from './dashboards/ParceiroDashboard.tsx';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading } = useApi();

  if (isLoading || !data || !user) {
    return (
      <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-28" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SkeletonLoader className="lg:col-span-2 h-80" />
              <SkeletonLoader className="h-80" />
          </div>
      </div>
    );
  }

  const { tasks, cases, leads, users, clients } = data;

  switch(user.role) {
    case 'MAESTRO':
      return <MaestroDashboard tasks={tasks} users={users} />;
    case 'Sócio':
      return <SocioDashboard user={user} />;
    case 'Controller':
      return <ControllerDashboard users={users} />;
    case 'Advogado Interno':
      return <AdvogadoDashboard user={user} tasks={tasks} cases={cases} clients={clients} />;
    case 'Advogado Parceiro':
        return <AdvogadoParceiroDashboard user={user} />;
    case 'SDR':
      return <SdrDashboard user={user} tasks={tasks} leads={leads} />;
    case 'Administrativo':
        return <AdminDashboard user={user} />;
    case 'Operador de Atendimento':
        return <OperadorDashboard user={user} />;
    case 'Parceiro Indicador':
    case 'Parceiro SDR':
    case 'Parceiro Outros':
        return <ParceiroDashboard user={user} />;
    default:
      return <MaestroDashboard tasks={tasks} users={users} />; // Default dashboard
  }
};
