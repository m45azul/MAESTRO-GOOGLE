import { GoogleGenAI, Type } from "@google/genai";
import { AIReconciliationResult, BankStatementItem, Transaction, User } from "../types.ts";

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }
    
    // The execution environment is expected to provide process.env.API_KEY.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.error("Chave de API não configurada. As funcionalidades de IA estão desabilitadas.");
        throw new Error("A chave da API não está configurada. As funcionalidades de IA estão indisponíveis.");
    }
    
    ai = new GoogleGenAI({ apiKey });
    return ai;
}


export const getAIInsights = async (kpiData: string): Promise<string> => {
  try {
    const client = getAiClient();
    const prompt = `
      Você é um consultor de inteligência de negócios para a MAESTRO, uma plataforma de gestão para escritórios de advocacia.
      Analise os seguintes KPIs do dashboard e forneça 3 insights estratégicos e acionáveis para o Sócio Administrador (MAESTRO).
      Seja conciso, direto e use um tom profissional. Formate a resposta como uma lista de pontos.

      KPIs Atuais:
      ${kpiData}
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Erro ao buscar insights da IA:", error);
    if (error instanceof Error) {
        return `Erro ao gerar insights: ${error.message}. Por favor, verifique sua chave de API e conexão de rede.`;
    }
    return "Ocorreu um erro desconhecido ao gerar os insights da IA.";
  }
};

export const getAICaseSummary = async (caseUpdates: string): Promise<string> => {
  try {
    const client = getAiClient();
    const prompt = `
      Você é um assistente jurídico de IA para a MAESTRO.
      Sua tarefa é ler a lista de andamentos de um processo judicial e criar um resumo conciso e objetivo do progresso do caso até o momento.
      Foque nos eventos mais importantes, como petições, decisões e audiências. Ignore andamentos puramente sistêmicos se não forem relevantes.
      O resumo deve ser fácil de entender para um advogado que está se atualizando sobre o caso.

      Andamentos do Processo:
      ${caseUpdates}

      Resumo Conciso:
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar resumo do caso com IA:", error);
    if (error instanceof Error) {
        return `Erro ao gerar resumo: ${error.message}.`;
    }
    return "Ocorreu um erro desconhecido ao gerar o resumo com IA.";
  }
};

export const getAIPredictiveAnalysis = async (caseInfo: string): Promise<string> => {
  try {
    const client = getAiClient();
    const prompt = `
      Você é um especialista em jurimetria e ciência de dados jurídicos para a MAESTRO.
      Analise as informações do processo judicial a seguir e, com base em um vasto conhecimento de jurisprudência e estatísticas, forneça uma análise preditiva.
      
      Informações do Processo:
      ${caseInfo}

      Sua resposta DEVE ser um objeto JSON, e nada mais. Use a seguinte estrutura:
      {
        "probabilidadeExito": <um número de 0 a 100>,
        "tempoEstimado": <um número de meses para a resolução>,
        "valorCondenacao": <um valor monetário estimado em caso de perda>
      }
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  probabilidadeExito: { type: Type.NUMBER },
                  tempoEstimado: { type: Type.NUMBER },
                  valorCondenacao: { type: Type.NUMBER },
              },
              required: ['probabilidadeExito', 'tempoEstimado', 'valorCondenacao'],
          },
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Erro ao buscar análise preditiva da IA:", error);
    if (error instanceof Error) {
        throw new Error(`Erro ao gerar análise preditiva: ${error.message}.`);
    }
    throw new Error("Ocorreu um erro desconhecido ao gerar a análise da IA.");
  }
};

export const getChatbotResponse = async (prompt: string): Promise<string> => {
    try {
        const client = getAiClient();
        const fullPrompt = `
            Você é a "Maestro AI", uma assistente de IA integrada à plataforma de gestão jurídica MAESTRO.
            Sua função é ajudar os usuários da plataforma com dúvidas sobre o sistema e sobre gestão jurídica em geral.
            Seja amigável, profissional e direto.

            Pergunta do usuário: "${prompt}"
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return response.text;
    } catch (error) {
        console.error("Erro ao buscar resposta do chatbot:", error);
        if (error instanceof Error) {
            return `Erro ao comunicar com a IA: ${error.message}.`;
        }
        return "Ocorreu um erro desconhecido ao obter uma resposta.";
    }
};

export const getAIReconciliation = async (statementItems: BankStatementItem[], transactions: Transaction[]): Promise<AIReconciliationResult> => {
    try {
        const client = getAiClient();
        const prompt = `
            Você é um assistente de IA especialista em finanças para a plataforma MAESTRO. Sua tarefa é realizar uma conciliação bancária.
            Você receberá uma lista de lançamentos de um extrato bancário e uma lista de transações já registradas no sistema.
            Analise ambos e retorne um objeto JSON estruturado com suas conclusões.

            Regras da Conciliação:
            1.  **automaticMatches**: Itens onde há uma correspondência EXATA de valor E data entre o extrato e uma transação não conciliada. A descrição também deve ser muito similar.
            2.  **suggestions**: Itens onde o valor é o mesmo, mas a data é próxima (até 3 dias de diferença), OU onde a data é a mesma, mas o valor é ligeiramente diferente (até 5%). A descrição deve ter alguma semelhança. Atribua um 'confidenceScore' de 0 a 100 e um 'reason' explicando a sugestão.
            3.  **unmatchedItems**: Itens do extrato que não se encaixam em nenhuma das categorias acima. Forneça um 'reason' curto (ex: "Nenhuma transação correspondente encontrada.").

            **Extrato Bancário:**
            ${JSON.stringify(statementItems, null, 2)}

            **Transações do Sistema (apenas as não conciliadas):**
            ${JSON.stringify(transactions.filter(t => !t.reconciled), null, 2)}

            Retorne APENAS o objeto JSON, sem nenhum texto adicional.
        `;
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.OBJECT,
                            properties: {
                                totalLines: { type: Type.NUMBER },
                                automaticMatches: { type: Type.NUMBER },
                                suggestions: { type: Type.NUMBER },
                                unmatched: { type: Type.NUMBER },
                                autoMatchPercentage: { type: Type.NUMBER },
                            },
                             required: ['totalLines', 'automaticMatches', 'suggestions', 'unmatched', 'autoMatchPercentage'],
                        },
                        automaticMatches: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    statementItem: { type: Type.OBJECT, properties: { id: { type: Type.STRING } }, required: ['id'] },
                                    transaction: { type: Type.OBJECT, properties: { id: { type: Type.STRING } }, required: ['id'] },
                                },
                                required: ['statementItem', 'transaction'],
                            }
                        },
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    statementItem: { type: Type.OBJECT, properties: { id: { type: Type.STRING } }, required: ['id'] },
                                    suggestedTransactions: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                transactionId: { type: Type.STRING },
                                                confidenceScore: { type: Type.NUMBER },
                                                reason: { type: Type.STRING },
                                            },
                                            required: ['transactionId', 'confidenceScore', 'reason'],
                                        }
                                    }
                                },
                                required: ['statementItem', 'suggestedTransactions'],
                            }
                        },
                        unmatchedItems: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    statementItem: { type: Type.OBJECT, properties: { id: { type: Type.STRING } }, required: ['id'] },
                                    reason: { type: Type.STRING },
                                },
                                required: ['statementItem', 'reason'],
                            }
                        }
                    },
                    required: ['summary', 'automaticMatches', 'suggestions', 'unmatchedItems'],
                },
            },
        });

        // The Gemini API might only return IDs. We need to re-hydrate the objects.
        const parsedResult = JSON.parse(response.text) as any;
        
        const hydrateResult = {
            ...parsedResult,
            automaticMatches: (parsedResult.automaticMatches || []).map((match: any) => ({
                statementItem: statementItems.find(s => s.id === match.statementItem.id),
                transaction: transactions.find(t => t.id === match.transaction.id),
            })).filter((m: any) => m.statementItem && m.transaction),

            suggestions: (parsedResult.suggestions || []).map((suggestion: any) => ({
                statementItem: statementItems.find(s => s.id === suggestion.statementItem.id),
                suggestedTransactions: (suggestion.suggestedTransactions || []).map((st: any) => ({
                    ...st,
                    transaction: transactions.find(t => t.id === st.transactionId)
                })).filter((st: any) => st.transaction)
            })).filter((s: any) => s.statementItem),

            unmatchedItems: (parsedResult.unmatchedItems || []).map((item: any) => ({
                statementItem: statementItems.find(s => s.id === item.statementItem.id),
                reason: item.reason,
            })).filter((i: any) => i.statementItem),
        };

        return hydrateResult;

    } catch (error) {
        console.error("Erro ao buscar conciliação da IA:", error);
        if (error instanceof Error) {
            throw new Error(`Erro ao gerar conciliação: ${error.message}.`);
        }
        throw new Error("Ocorreu um erro desconhecido ao gerar a conciliação da IA.");
    }
};

export const getAIDocumentAnalysis = async (documentContent: string): Promise<string> => {
    try {
        const client = getAiClient();
        const prompt = `
            Você é um assistente jurídico de IA para a MAESTRO.
            Sua tarefa é ler o conteúdo de um documento jurídico (geralmente o nome do arquivo, neste mock) e criar um resumo executivo dos pontos-chave.
            Seja conciso e foque em: partes envolvidas, objeto principal, valores, datas importantes e pedidos.

            Conteúdo do Documento (nome do arquivo):
            ${documentContent}

            Resumo Executivo (Exemplo: "Petição inicial de Maria Santos contra Cia Aérea Voar Alto, pleiteando indenização por danos morais no valor de R$ 25.000 devido a cancelamento de voo."):
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Erro ao buscar análise de documento com IA:", error);
        return "Não foi possível analisar o documento.";
    }
};
