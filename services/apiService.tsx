// This file acts as a simulated backend API.
// In a real application, these functions would make network requests to a server.

import { 
    mockLeads, 
    mockCases, 
    mockClients, 
    mockTransactions, 
    mockAppointments, 
    mockMuralPosts, 
    mockChatMessages, 
    mockChatConversations, 
    mockUsers,
    mockTasks,
    mockTags,
    mockMetas,
    mockRanking,
    mockSupportConversations,
    mockSupportMessages,
} from '../data/allData.ts';
import { AppData, Lead, LegalCase, Client, Transaction, Contract, Appointment, MuralPost, ChatMessage, Task, Note, TimeLog, Tag, Document, User } from '../types.ts';
import { getAIDocumentAnalysis } from './geminiService.ts';

// Simulate network latency
const API_LATENCY = 300;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- DATA STORE (simulates a database) ---
let data: AppData = {
    leads: [...mockLeads],
    cases: [...mockCases],
    clients: [...mockClients],
    contracts: [] as Contract[],
    transactions: [...mockTransactions],
    appointments: [...mockAppointments],
    tasks: [...mockTasks],
    muralPosts: [...mockMuralPosts],
    chatConversations: [...mockChatConversations],
    chatMessages: [...mockChatMessages],
    users: [...mockUsers],
    tags: [...mockTags],
    metas: [...mockMetas],
    ranking: [...mockRanking],
    supportConversations: [...mockSupportConversations],
    supportMessages: [...mockSupportMessages]
};

const clone = <T,>(d: T): T => JSON.parse(JSON.stringify(d));

// --- API Service ---
export const apiService = {
    // GET all data
    async getAllData(): Promise<AppData> {
        await delay(API_LATENCY * 3);
        console.log("API: Fetched all initial data.");
        return clone(data);
    },

    // --- Leads ---
    async addLead(newLeadData: Omit<Lead, 'id' | 'stage'>): Promise<Lead> {
        await delay(API_LATENCY);
        const newLead: Lead = {
            ...newLeadData,
            id: `lead-${Date.now()}`,
            stage: 'Novo',
        };
        data.leads = [newLead, ...data.leads];
        console.log("API: Added lead", newLead);
        return clone(newLead);
    },
    async updateLead(updatedLead: Lead): Promise<Lead> {
        await delay(API_LATENCY);
        if (!data.leads.some(lead => lead.id === updatedLead.id)) throw new Error(`Lead with ID ${updatedLead.id} not found.`);
        data.leads = data.leads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead));
        console.log("API: Updated lead", updatedLead);
        return clone(updatedLead);
    },
    async deleteLead(leadId: string): Promise<string> {
        await delay(API_LATENCY);
        if (!data.leads.some(lead => lead.id === leadId)) throw new Error(`Lead with ID ${leadId} not found.`);
        data.leads = data.leads.map(lead => (lead.id === leadId ? { ...lead, isDeleted: true } : lead));
        console.log("API: Deleted lead", leadId);
        return leadId;
    },
    
    // --- Clients, Contracts, Cases (for Workflow) ---
    async addClient(newClientData: Omit<Client, 'id'>): Promise<Client> {
        await delay(API_LATENCY);
        const newClient: Client = { ...newClientData, id: `client-${Date.now()}` };
        data.clients = [...data.clients, newClient];
        console.log("API: Added client", newClient);
        return clone(newClient);
    },
    async addContract(newContractData: Omit<Contract, 'id'>): Promise<Contract> {
        await delay(API_LATENCY);
        const newContract: Contract = { ...newContractData, id: `contract-${Date.now()}` };
        data.contracts = [...data.contracts, newContract];
        console.log("API: Added contract", newContract);
        return clone(newContract);
    },
    async addCase(newCaseData: Omit<LegalCase, 'id'>): Promise<LegalCase> {
        await delay(API_LATENCY);
        const newCase: LegalCase = { ...newCaseData, id: `case-${Date.now()}` };
        data.cases = [...data.cases, newCase];
        console.log("API: Added case", newCase);
        return clone(newCase);
    },
    async saveCase(caseData: Omit<LegalCase, 'id'> & { id?: string }): Promise<LegalCase> {
        await delay(API_LATENCY);
        if (caseData.id) { // Update
            const caseIndex = data.cases.findIndex(c => c.id === caseData.id);
            if (caseIndex === -1) throw new Error(`Case with ID ${caseData.id} not found.`);
            const updatedCase = { ...data.cases[caseIndex], ...caseData };
            data.cases = data.cases.map(c => c.id === caseData.id ? updatedCase : c);
            return clone(updatedCase);
        } else { // Create
            const newCase: LegalCase = {
                ...(caseData as Omit<LegalCase, 'id'>),
                id: `case-${Date.now()}`,
            };
            data.cases = [newCase, ...data.cases];
            return clone(newCase);
        }
    },
     async updateCaseStatus(caseId: string, status: LegalCase['status']): Promise<LegalCase> {
        await delay(API_LATENCY);
        let updatedCase: LegalCase | undefined;
        data.cases = data.cases.map(c => {
            if (c.id === caseId) {
                updatedCase = { ...c, status };
                return updatedCase;
            }
            return c;
        });
        if (!updatedCase) throw new Error(`Case with ID ${caseId} not found.`);
        return clone(updatedCase);
    },
    async addCaseUpdate(caseId: string, authorId: string, description: string): Promise<LegalCase> {
        await delay(API_LATENCY);
        const author = data.users.find(u => u.id === authorId);
        let updatedCase: LegalCase | undefined;
        data.cases = data.cases.map(c => {
            if (c.id === caseId) {
                const newUpdate = { id: `u-${caseId}-${c.updates.length + 1}`, date: new Date().toISOString().split('T')[0], author: author?.name || 'Sistema', description };
                updatedCase = { ...c, updates: [...c.updates, newUpdate] };
                return updatedCase;
            }
            return c;
        });
        if (!updatedCase) throw new Error(`Case with ID ${caseId} not found.`);
        return clone(updatedCase);
    },
    async addTimeLog(caseId: string, timeLogData: Omit<TimeLog, 'id' | 'status'>): Promise<LegalCase> {
        await delay(API_LATENCY);
        let updatedCase: LegalCase | undefined;
        data.cases = data.cases.map(c => {
            if (c.id === caseId) {
                const newTimeLog: TimeLog = { ...timeLogData, id: `tl-${caseId}-${c.timesheet.length + 1}`, status: 'Pendente' };
                updatedCase = { ...c, timesheet: [...c.timesheet, newTimeLog] };
                return updatedCase;
            }
            return c;
        });
        if (!updatedCase) throw new Error(`Case with ID ${caseId} not found.`);
        return clone(updatedCase);
    },
    async updateTimeLogStatus(caseId: string, timeLogId: string, status: TimeLog['status']): Promise<LegalCase> {
        await delay(API_LATENCY);
        let updatedCase: LegalCase | undefined;
        data.cases = data.cases.map(c => {
            if (c.id === caseId) {
                const updatedTimesheet = c.timesheet.map(tl => tl.id === timeLogId ? {...tl, status} : tl);
                updatedCase = { ...c, timesheet: updatedTimesheet };
                return updatedCase;
            }
            return c;
        });
        if (!updatedCase) throw new Error(`Case with ID ${caseId} not found.`);
        return clone(updatedCase);
    },
    async syncCaseWithCourt(caseId: string): Promise<LegalCase> {
        await delay(API_LATENCY * 2);
        let updatedCase: LegalCase | undefined;
        data.cases = data.cases.map(c => {
            if (c.id === caseId) {
                const newUpdate = { id: `u-${caseId}-${c.updates.length + 1}`, date: new Date().toISOString().split('T')[0], author: "Sistema do Tribunal", description: 'Sincronizado com o sistema do tribunal. Nova movimentação identificada.' };
                updatedCase = { ...c, updates: [...c.updates, newUpdate] };
                return updatedCase;
            }
            return c;
        });
        if (!updatedCase) throw new Error(`Case with ID ${caseId} not found.`);
        console.log("API: Synced case with court", caseId);
        return clone(updatedCase);
    },
    async uploadDocument(caseId: string, file: File): Promise<Document> {
        await delay(API_LATENCY);
        const newDocument: Document = { id: `doc-${Date.now()}`, name: file.name, url: URL.createObjectURL(file), uploadDate: new Date().toISOString(), version: 1 };
        let caseFound = false;
        data.cases = data.cases.map(c => {
            if (c.id === caseId) {
                caseFound = true;
                return { ...c, documents: [...(c.documents || []), newDocument] };
            }
            return c;
        });
        if (!caseFound) throw new Error(`Case with ID ${caseId} not found.`);
        console.log("API: Uploaded document", newDocument, "to case", caseId);
        return newDocument;
    },
    async analyzeDocument(caseId: string, documentId: string): Promise<Document> {
        await delay(API_LATENCY * 4);
        let analyzedDocument: Document | undefined;
        try {
            const docToUpdate = data.cases.flatMap(c => c.documents).find(d => d.id === documentId);
            if (!docToUpdate) throw new Error('Document not found for analysis.');
            const analysisText = await getAIDocumentAnalysis(docToUpdate.name);
            analyzedDocument = { ...docToUpdate, extractedText: analysisText, analysisStatus: 'completed' as const };
            
            data.cases = data.cases.map(c => c.id === caseId ? { ...c, documents: c.documents.map(d => d.id === documentId ? analyzedDocument! : d) } : c);

            console.log("API: Analyzed document", documentId);
            return clone(analyzedDocument);
        } catch(e) {
            data.cases = data.cases.map(c => c.id === caseId ? { ...c, documents: c.documents.map(d => d.id === documentId ? { ...d, analysisStatus: 'failed' as const } : d) } : c);
            throw e;
        }
    },

    // --- Client Notes ---
    async addClientNote(clientId: string, authorId: string, content: string): Promise<Note> {
        await delay(API_LATENCY);
        const newNote: Note = { id: `note-${Date.now()}`, authorId, content, timestamp: new Date().toISOString() };
        let clientFound = false;
        data.clients = data.clients.map(c => {
            if (c.id === clientId) {
                clientFound = true;
                return { ...c, notes: [...(c.notes || []), newNote] };
            }
            return c;
        });
        if (!clientFound) throw new Error(`Client with ID ${clientId} not found.`);
        console.log("API: Added note to client", clientId);
        return clone(newNote);
    },
    async updateClientNote(clientId: string, noteId: string, content: string): Promise<Note | null> {
        await delay(API_LATENCY);
        let updatedNote: Note | undefined;
        data.clients = data.clients.map(c => {
            if (c.id === clientId && c.notes) {
                const notes = c.notes.map(note => {
                    if (note.id === noteId) {
                        updatedNote = { ...note, content, timestamp: new Date().toISOString() };
                        return updatedNote;
                    }
                    return note;
                });
                return { ...c, notes };
            }
            return c;
        });
        if (updatedNote) {
            console.log("API: Updated note", noteId, "for client", clientId);
            return clone(updatedNote);
        }
        return null;
    },
    async deleteClientNote(clientId: string, noteId: string): Promise<string | null> {
        await delay(API_LATENCY);
        let noteDeleted = false;
        data.clients = data.clients.map(c => {
            if (c.id === clientId && c.notes) {
                const originalLength = c.notes.length;
                const newNotes = c.notes.filter(note => note.id !== noteId);
                if (newNotes.length < originalLength) noteDeleted = true;
                return { ...c, notes: newNotes };
            }
            return c;
        });
        if (noteDeleted) {
            console.log("API: Deleted note", noteId, "from client", clientId);
            return noteId;
        }
        return null;
    },
    
    // Transactions
    async saveTransaction(transactionData: Omit<Transaction, 'id' | 'reconciled'> & { id?: string }): Promise<Transaction> {
        await delay(API_LATENCY);
        if (transactionData.id) { // Update
            const updatedTransaction = { ...data.transactions.find(t => t.id === transactionData.id)!, ...transactionData };
            data.transactions = data.transactions.map(t => t.id === transactionData.id ? updatedTransaction : t);
            return clone(updatedTransaction);
        } else { // Create
            const newTransaction: Transaction = { ...(transactionData as Omit<Transaction, 'id' | 'reconciled'>), id: `trans-${Date.now()}`, reconciled: false };
            data.transactions = [newTransaction, ...data.transactions];
            return clone(newTransaction);
        }
    },
    async deleteTransaction(transactionId: string): Promise<string> {
        await delay(API_LATENCY);
        if (!data.transactions.some(t => t.id === transactionId)) throw new Error(`Transaction with ID ${transactionId} not found.`);
        data.transactions = data.transactions.map(t => t.id === transactionId ? { ...t, isDeleted: true } : t);
        return transactionId;
    },
    async confirmReconciliation(transactionIds: string[]): Promise<Transaction[]> {
        await delay(API_LATENCY);
        const updatedTransactions: Transaction[] = [];
        const idsToUpdate = new Set(transactionIds);
        data.transactions = data.transactions.map(t => {
            if (idsToUpdate.has(t.id)) {
                const updated = { ...t, reconciled: true };
                updatedTransactions.push(updated);
                return updated;
            }
            return t;
        });
        console.log(`API: Reconciled ${updatedTransactions.length} transactions.`);
        return updatedTransactions;
    },
    
    // Users
    async saveUser(userData: Omit<User, 'id' | 'avatarUrl'> | User): Promise<User> {
        await delay(API_LATENCY);
        if ('id' in userData) { // Update
            const updatedUser = { ...data.users.find(u => u.id === userData.id)!, ...userData };
            data.users = data.users.map(u => u.id === userData.id ? updatedUser : u);
            return clone(updatedUser);
        } else { // Create
            const newUser: User = { ...(userData as Omit<User, 'id' | 'avatarUrl'>), id: `user-${Date.now()}`, avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}` };
            data.users = [newUser, ...data.users];
            return clone(newUser);
        }
    },
    async toggleUserStatus(userId: string): Promise<User> {
        await delay(API_LATENCY);
        let updatedUser: User | undefined;
        data.users = data.users.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' };
                return updatedUser;
            }
            return u;
        });
        if (!updatedUser) throw new Error(`User with ID ${userId} not found.`);
        return clone(updatedUser);
    },
    
    // Tags
    async saveTag(tagData: Omit<Tag, 'id'> | Tag): Promise<Tag> {
        await delay(API_LATENCY);
        if ('id' in tagData && tagData.id) { // Update
            const updatedTag = { ...data.tags.find(t => t.id === tagData.id)!, ...tagData };
            data.tags = data.tags.map(t => t.id === tagData.id ? updatedTag : t);
            console.log("API: Updated tag", updatedTag);
            return clone(updatedTag);
        } else { // Create
            const newTag: Tag = { ...(tagData as Omit<Tag, 'id' | 'isActive'>), id: `tag-${Date.now()}`, isActive: true };
            data.tags = [newTag, ...data.tags];
            console.log("API: Added tag", newTag);
            return clone(newTag);
        }
    },
    async toggleTagStatus(tagId: string): Promise<Tag> {
        await delay(API_LATENCY);
        let updatedTag: Tag | undefined;
        data.tags = data.tags.map(t => {
            if (t.id === tagId) {
                updatedTag = { ...t, isActive: !t.isActive };
                return updatedTag;
            }
            return t;
        });
        if (!updatedTag) throw new Error(`Tag with ID ${tagId} not found.`);
        console.log("API: Toggled tag status", updatedTag);
        return clone(updatedTag);
    },

    // Mural
    async addMuralPost(authorId: string, content: string): Promise<MuralPost> {
        await delay(API_LATENCY);
        const newPost: MuralPost = { id: `post-${Date.now()}`, authorId, content, timestamp: new Date().toISOString(), likes: [], comments: [] };
        data.muralPosts = [newPost, ...data.muralPosts];
        return clone(newPost);
    },
    async likeMuralPost(postId: string, userId: string): Promise<MuralPost> {
        await delay(API_LATENCY);
        let updatedPost: MuralPost | undefined;
        data.muralPosts = data.muralPosts.map(p => {
            if (p.id === postId) {
                const hasLiked = p.likes.includes(userId);
                const newLikes = hasLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId];
                updatedPost = { ...p, likes: newLikes };
                return updatedPost;
            }
            return p;
        });
        if (!updatedPost) throw new Error(`Post with ID ${postId} not found.`);
        return clone(updatedPost);
    },
    async addMuralComment(postId: string, authorId: string, content: string): Promise<MuralPost> {
        await delay(API_LATENCY);
        let updatedPost: MuralPost | undefined;
        data.muralPosts = data.muralPosts.map(p => {
            if (p.id === postId) {
                const newComment = { id: `c-${Date.now()}`, authorId, content, timestamp: new Date().toISOString() };
                updatedPost = { ...p, comments: [...p.comments, newComment] };
                return updatedPost;
            }
            return p;
        });
        if (!updatedPost) throw new Error(`Post with ID ${postId} not found.`);
        return clone(updatedPost);
    },
    
    // Chat
    async addChatMessage(fromId: string, toId: string, content: string): Promise<ChatMessage> {
        await delay(API_LATENCY / 2);
        const newMessage: ChatMessage = { id: `msg-${Date.now()}`, fromId, toId, content, timestamp: new Date().toISOString(), read: true };
        data.chatMessages = [...data.chatMessages, newMessage];
        return clone(newMessage);
    },
    
    // Appointments
    async saveAppointment(appointmentData: Omit<Appointment, 'id'> | Appointment): Promise<Appointment> {
        await delay(API_LATENCY);
        if ('id' in appointmentData) { // Update
            const updatedAppointment = { ...data.appointments.find(a => a.id === appointmentData.id)!, ...appointmentData };
            data.appointments = data.appointments.map(a => a.id === appointmentData.id ? updatedAppointment : a);
            return clone(updatedAppointment);
        } else { // Create
            const newAppointment: Appointment = { ...(appointmentData as Omit<Appointment, 'id'>), id: `app-${Date.now()}` };
            data.appointments = [newAppointment, ...data.appointments];
            return clone(newAppointment);
        }
    },
    async deleteAppointment(appointmentId: string): Promise<string> {
        await delay(API_LATENCY);
        const initialLength = data.appointments.length;
        data.appointments = data.appointments.filter(a => a.id !== appointmentId);
        if (data.appointments.length === initialLength) throw new Error(`Appointment with ID ${appointmentId} not found.`);
        return appointmentId;
    },
};