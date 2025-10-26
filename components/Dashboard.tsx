import React from 'react';
import type { User } from '../types';
import { MaestroDashboard } from './dashboards/MaestroDashboard';
import { SdrDashboard } from './dashboards/SdrDashboard';
import { AdvogadoDashboard } from './dashboards/AdvogadoDashboard';
import { ControllerDashboard } from './dashboards/ControllerDashboard';

interface DashboardProps {
    user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  switch(user.role) {
    case 'MAESTRO':
      return <MaestroDashboard />;
    case 'SDR':
      return <SdrDashboard user={user} />;
    case 'Advogado Interno':
      return <AdvogadoDashboard user={user} />;
    case 'Controller':
      return <ControllerDashboard />;
    default:
      return <MaestroDashboard />; // Default dashboard
  }
};