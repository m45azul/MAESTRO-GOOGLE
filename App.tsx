
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { useAuth } from './context/AuthContext.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { CrmPage } from './pages/CrmPage.tsx';
import { AgendaPage } from './pages/AgendaPage.tsx';
import { LegalPage } from './pages/LegalPage.tsx';
import { FinancePage } from './pages/FinancePage.tsx';
import { CarteiraPage } from './pages/CarteiraPage.tsx';
import { ClientsPage } from './pages/ClientsPage.tsx';
import { ClientPortalPage } from './pages/ClientPortalPage.tsx';
import { SocioPage } from './pages/SocioPage.tsx';
import { EquipePage } from './pages/EquipePage.tsx';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage.tsx';
import { WorkflowPage } from './pages/WorkflowPage.tsx';
import { MuralPage } from './pages/MuralPage.tsx';
import { ChatPage } from './pages/ChatPage.tsx';
import { BonusPage } from './pages/BonusPage.tsx';
import { BiPage } from './pages/BiPage.tsx';
import { AtendimentoPage } from './pages/AtendimentoPage.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { ApiProvider } from './context/ApiContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';

const routes: { [key: string]: { component: React.FC<any>; title: string; } } = {
    '/': { component: Dashboard, title: 'Dashboard' },
    '/agenda': { component: AgendaPage, title: 'Agenda' },
    '/mural': { component: MuralPage, title: 'Mural da Equipe' },
    '/chat': { component: ChatPage, title: 'Chat Interno' },
    '/crm': { component: CrmPage, title: 'CRM / Comercial' },
    '/clientes': { component: ClientsPage, title: 'Gestão de Clientes' },
    '/juridico': { component: LegalPage, title: 'Gestão de Processos' },
    '/financeiro': { component: FinancePage, title: 'Financeiro' },
    '/atendimento': { component: AtendimentoPage, title: 'Atendimento ao Cliente' },
    '/bonus': { component: BonusPage, title: 'Bônus e Prêmios' },
    '/carteira': { component: CarteiraPage, title: 'Minha Carteira' },
    '/bi': { component: BiPage, title: 'Business Intelligence' },
    '/societario': { component: SocioPage, title: 'Societário' },
    '/workflow': { component: WorkflowPage, title: 'Automação de Workflows' },
    '/equipe': { component: EquipePage, title: 'Gestão de Equipe' },
    '/portal-cliente': { component: ClientPortalPage, title: 'Portal do Cliente (Simulação)' },
    '/configuracoes': { component: ConfiguracoesPage, title: 'Configurações' },
};

const getRouteFromHash = () => window.location.hash.substring(1) || '/';

const DashboardLayout: React.FC = () => {
    const [route, setRoute] = useState(getRouteFromHash());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(getRouteFromHash());
        };
        window.addEventListener('hashchange', handleHashChange);
        // Set initial route
        if (window.location.hash === '') {
            window.location.hash = '#/';
        } else {
            handleHashChange();
        }
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const CurrentPage = routes[route]?.component || Dashboard;
    const title = routes[route]?.title || 'Dashboard';

    return (
        <div className="flex h-screen bg-slate-900 text-slate-200">
            <Sidebar currentRoute={route} setIsOpen={setIsSidebarOpen} isOpen={isSidebarOpen} />
            <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out`}>
                <Header title={title} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <CurrentPage />
                </main>
            </div>
            <Chatbot />
        </div>
    );
};

const App: React.FC = () => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <LoginPage />;
    }

    return (
        <NotificationProvider>
            <ApiProvider>
                <DashboardLayout />
            </ApiProvider>
        </NotificationProvider>
    );
};

export default App;
