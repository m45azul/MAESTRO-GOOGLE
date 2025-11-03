// This service orchestrates complex, multi-step business processes (workflows).
import { apiService } from './apiService.tsx';
import { Lead, Client, Contract, LegalCase } from '../types.ts';

interface ConvertLeadPayload {
    lead: Lead;
    createCase: boolean;
    caseTitle: string;
    responsibleId: string;
}

interface ConvertLeadResult {
    client: Client;
    contract: Contract;
    legalCase: LegalCase | null;
}

const workflows = {
    CONVERT_LEAD: async (payload: ConvertLeadPayload): Promise<ConvertLeadResult> => {
        const { lead, createCase, caseTitle, responsibleId } = payload;
        
        console.log("WORKFLOW: Starting lead conversion for", lead.name);

        // Step 1: Create Client
        const newClient = await apiService.addClient({
            name: lead.name,
            type: lead.company.includes('S.A.') || lead.company.includes('Ltda') ? 'Pessoa Jurídica' : 'Pessoa Física',
            cpfCnpj: '00.000.000/0001-00', // Mock data
            email: lead.email,
            phone: lead.phone,
            conversionDate: new Date().toISOString().split('T')[0],
            originLeadId: lead.id,
            notes: [],
        });

        // Step 2: Create Contract
        const newContract = await apiService.addContract({
            clientId: newClient.id,
            type: 'Percentual',
            value: lead.value,
            description: `Contrato de honorários para ${lead.description || lead.name}`,
            startDate: new Date().toISOString().split('T')[0],
        });

        let newCase: LegalCase | null = null;
        // Step 3 (Optional): Create Legal Case
        if (createCase && responsibleId) {
            newCase = await apiService.addCase({
                processNumber: `PROC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
                title: caseTitle,
                clientId: newClient.id,
                contractId: newContract.id,
                status: 'Ativo',
                responsibleId: responsibleId,
                opposingParty: 'A Definir',
                court: 'A Definir',
                updates: [{ id: 'u1', date: new Date().toISOString().split('T')[0], author: 'Sistema', description: 'Processo criado a partir da conversão do lead.' }],
                timesheet: [],
                tags: lead.tags,
                valorCausa: lead.value * 1.5,
                honorariosPrevistos: lead.value,
                percentualAdvogado: 30,
                documents: [],
                tribunal: 'A Definir',
                complexidade: 'Simples',
            });
        }
        
        console.log("WORKFLOW: Finished lead conversion.");
        return {
            client: newClient,
            contract: newContract,
            legalCase: newCase
        };
    }
};

export const workflowService = {
    trigger: async (workflowName: keyof typeof workflows, payload: any) => {
        if (workflows[workflowName]) {
            return await workflows[workflowName](payload);
        }
        throw new Error(`Workflow "${workflowName}" not found.`);
    }
};