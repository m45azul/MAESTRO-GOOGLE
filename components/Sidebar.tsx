import React from 'react';
import { CrmIcon, DashboardIcon, FinanceIcon, LegalIcon, MaestroLogo, SettingsIcon, TeamIcon, LogoutIcon, CalendarIcon, WalletIcon, UsersIcon, BuildingIcon, BriefcaseIcon, WorkflowIcon, MessageSquareIcon, AwardIcon } from './icons';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
      active
        ? 'bg-slate-700 text-white'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

interface SidebarProps {
    currentRoute: string;
    setRoute: (route: string) => void;
}

interface NavItemConfig {
    path: string;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    roles: UserRole[];
    sectionBreak?: boolean;
}

const ALL_ROLES: UserRole[] = ['MAESTRO', 'Sócio', 'Controller', 'Advogado Interno', 'Advogado Parceiro', 'SDR', 'Administrativo', 'Operador de Atendimento', 'Parceiro Indicador', 'Parceiro SDR', 'Parceiro Outros'];

const NAV_ITEMS: NavItemConfig[] = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon, roles: ALL_ROLES },
    { path: '/agenda', label: 'Agenda', icon: CalendarIcon, roles: ['MAESTRO', 'Controller', 'Advogado Interno', 'SDR', 'Administrativo', 'Operador de Atendimento'] },
    { path: '/recados', label: 'Recados', icon: MessageSquareIcon, roles: ALL_ROLES },
    { path: '/crm', label: 'CRM/Comercial', icon: CrmIcon, roles: ['MAESTRO', 'Controller', 'SDR', 'Parceiro SDR', 'Advogado Interno'], sectionBreak: true },
    { path: '/clientes', label: 'Clientes', icon: UsersIcon, roles: ['MAESTRO', 'Controller', 'Advogado Interno', 'SDR', 'Parceiro SDR', 'Operador de Atendimento', 'Administrativo'] },
    { path: '/juridico', label: 'Jurídico', icon: LegalIcon, roles: ['MAESTRO', 'Controller', 'Advogado Interno', 'Advogado Parceiro'] },
    { path: '/financeiro', label: 'Financeiro', icon: FinanceIcon, roles: ['MAESTRO', 'Administrativo'] },
    { path: '/bonus', label: 'Bônus e Prêmios', icon: AwardIcon, roles: ALL_ROLES, sectionBreak: true },
    { path: '/carteira', label: 'Minha Carteira', icon: WalletIcon, roles: ['Controller', 'Advogado Interno', 'Advogado Parceiro', 'SDR', 'Parceiro SDR', 'Parceiro Indicador'] },
    { path: '/societario', label: 'Societário', icon: BriefcaseIcon, roles: ['MAESTRO', 'Sócio'] },
    { path: '/workflow', label: 'Workflow Engine', icon: WorkflowIcon, roles: ['MAESTRO'] },
    { path: '/equipe', label: 'Equipe', icon: TeamIcon, roles: ['MAESTRO', 'Controller'], sectionBreak: true },
    { path: '/portal-cliente', label: 'Portal do Cliente', icon: BuildingIcon, roles: ALL_ROLES },
    { path: '/configuracoes', label: 'Configurações', icon: SettingsIcon, roles: ['MAESTRO'], sectionBreak: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, setRoute }) => {
    const { user, logout } = useAuth();
    if (!user) return null;

    const availableNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

    return (
        <aside className="w-64 flex-shrink-0 bg-slate-800/50 hidden md:flex flex-col border-r border-slate-700/50">
            <div className="flex items-center h-16 px-6 border-b border-slate-700/50 flex-shrink-0">
                <MaestroLogo />
                <span className="ml-3 text-lg font-semibold text-white">MAESTRO</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
                 {availableNavItems.map((item) => (
                    <React.Fragment key={item.path}>
                        {item.sectionBreak && <div className="pt-2 mt-2 border-t border-slate-700/50"></div>}
                        <NavItem 
                            icon={<item.icon className="w-5 h-5" />} 
                            label={item.label} 
                            active={currentRoute === item.path} 
                            onClick={() => setRoute(item.path)} 
                        />
                    </React.Fragment>
                ))}
            </nav>
            <div className="px-4 py-4 mt-auto border-t border-slate-700/50">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                    <LogoutIcon className="w-5 h-5" />
                    <span className="ml-3">Sair</span>
                </button>
            </div>
        </aside>
    );
};