import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { CrmPage } from './pages/CrmPage';
import { AgendaPage } from './pages/AgendaPage';
import { LegalPage } from './pages/LegalPage';
import { FinancePage } from './pages/FinancePage';
import { CarteiraPage } from './pages/CarteiraPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { SocioPage } from './pages/SocioPage';
import { EquipePage } from './pages/EquipePage';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { RecadosPage } from './pages/RecadosPage';
import { BonusPage } from './pages/BonusPage';
import { Chatbot } from './components/Chatbot';
import { mockLeads } from './data/leads';
import { mockCases } from './data/cases';
import { mockClients } from './data/clients';
import { mockTransactions } from './data/transactions';
import { mockAppointments } from './data/appointments';
import { mockRecados, mockConversations } from './data/recados';
import { mockUsers } from './data/users';
import type { Lead, LegalCase, Client, Transaction, Contract, Appointment, Recado, Conversation, User } from './types';


const DashboardLayout: React.FC = () => {
    const { user } = useAuth();
    const [route, setRoute] = useState('/');
    
    // Lift state up to manage data across modules
    const [leads, setLeads] = useState<Lead[]>(mockLeads);
    const [cases, setCases] = useState<LegalCase[]>(mockCases);
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
    const [recados, setRecados] = useState<Recado[]>(mockRecados);
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [users, setUsers] = useState<User[]>(mockUsers);


    if (!user) return <LoginPage />;

    const renderContent = () => {
        switch (route) {
            case '/crm':
                return <CrmPage leads={leads} setLeads={setLeads} setClients={setClients} setContracts={setContracts} setCases={setCases} allUsers={users} />;
            case '/agenda':
                return <AgendaPage appointments={appointments} setAppointments={setAppointments} allUsers={users} />;
            case '/juridico':
                return <LegalPage cases={cases} setCases={setCases} allUsers={users} />;
            case '/financeiro':
                return <FinancePage transactions={transactions} setTransactions={setTransactions} />;
            case '/carteira':
                return <CarteiraPage />;
            case '/clientes':
                return <ClientsPage clients={clients} />;
            case '/portal-cliente':
                return <ClientPortalPage />;
            case '/societario':
                return <SocioPage />;
            case '/equipe':
                return <EquipePage users={users} setUsers={setUsers} />;
            case '/recados':
                return <RecadosPage recados={recados} setRecados={setRecados} conversations={conversations} setConversations={setConversations} allUsers={users} />;
            case '/bonus':
                return <BonusPage />;
            case '/workflow':
                return <WorkflowPage />;
            case '/configuracoes':
                return <ConfiguracoesPage />;
            case '/':
            default:
                return <Dashboard user={user} />;
        }
    };
    
    const getTitle = () => {
        switch(route) {
            case '/crm': return 'CRM / Comercial';
            case '/agenda': return 'Agenda';
            case '/juridico': return 'Jurídico';
            case '/financeiro': return 'Financeiro';
            case '/carteira': return 'Minha Carteira';
            case '/clientes': return 'Clientes';
            case '/portal-cliente': return 'Portal do Cliente';
            case '/societario': return 'Societário';
            case '/equipe': return 'Equipe';
            case '/recados': return 'Recados';
            case '/bonus': return 'Bônus e Prêmios';
            case '/workflow': return 'Workflow Engine';
            case '/configuracoes': return 'Configurações';
            case '/':
            default: return 'Dashboard';
        }
    }

    return (
        <div className="flex h-screen bg-slate-900 text-slate-200 font-sans">
            <Sidebar currentRoute={route} setRoute={setRoute} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={getTitle()} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4 md:p-8">
                    {renderContent()}
                </main>
            </div>
            <Chatbot />
        </div>
    )
}

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  
  return isLoggedIn ? <DashboardLayout /> : <LoginPage />;
};

export default App;