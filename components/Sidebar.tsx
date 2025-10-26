import React from 'react';
import { CrmIcon, DashboardIcon, FinanceIcon, LegalIcon, MaestroLogo, SettingsIcon, TeamIcon, LogoutIcon, CalendarIcon, WalletIcon, TagIcon, UsersIcon } from './icons';
import { useAuth } from '../context/AuthContext';

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

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, setRoute }) => {
    const { logout } = useAuth();
    return (
        <aside className="w-64 flex-shrink-0 bg-slate-800/50 hidden md:flex flex-col border-r border-slate-700/50">
        <div className="flex items-center h-16 px-6 border-b border-slate-700/50 flex-shrink-0">
            <MaestroLogo />
            <span className="ml-3 text-lg font-semibold text-white">MAESTRO</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <NavItem icon={<DashboardIcon className="w-5 h-5" />} label="Dashboard" active={currentRoute === '/'} onClick={() => setRoute('/')} />
            <NavItem icon={<CalendarIcon className="w-5 h-5" />} label="Agenda" active={currentRoute === '/agenda'} onClick={() => setRoute('/agenda')} />
            <NavItem icon={<CrmIcon className="w-5 h-5" />} label="CRM/Comercial" active={currentRoute === '/crm'} onClick={() => setRoute('/crm')} />
            <NavItem icon={<UsersIcon className="w-5 h-5" />} label="Clientes" active={currentRoute === '/clientes'} onClick={() => setRoute('/clientes')} />
            <NavItem icon={<LegalIcon className="w-5 h-5" />} label="Jurídico" active={currentRoute === '/juridico'} onClick={() => setRoute('/juridico')} />
            <NavItem icon={<WalletIcon className="w-5 h-5" />} label="Minha Carteira" active={currentRoute === '/carteira'} onClick={() => setRoute('/carteira')} />
            <NavItem icon={<FinanceIcon className="w-5 h-5" />} label="Financeiro" active={currentRoute === '/financeiro'} onClick={() => setRoute('/financeiro')} />
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