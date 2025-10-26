
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsights = async (kpiData: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. AI insights are unavailable.";
  }
  
  try {
    const prompt = `
      Você é um consultor de inteligência de negócios para a MAESTRO, uma plataforma de gestão para escritórios de advocacia.
      Analise os seguintes KPIs do dashboard e forneça 3 insights estratégicos e acionáveis para o Sócio Administrador (MAESTRO).
      Seja conciso, direto e use um tom profissional. Formate a resposta como uma lista de pontos.

      KPIs Atuais:
      ${kpiData}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    if (error instanceof Error) {
        return `Error generating insights: ${error.message}. Please check your API key and network connection.`;
    }
    return "An unknown error occurred while generating AI insights.";
  }
};

export const getAICaseSummary = async (caseUpdates: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. AI features are unavailable.";
  }
  
  try {
    const prompt = `
      Você é um assistente jurídico de IA para a MAESTRO.
      Sua tarefa é ler a lista de andamentos de um processo judicial e criar um resumo conciso e objetivo do progresso do caso até o momento.
      Foque nos eventos mais importantes, como petições, decisões e audiências. Ignore andamentos puramente sistêmicos se não forem relevantes.
      O resumo deve ser fácil de entender para um advogado que está se atualizando sobre o caso.

      Andamentos do Processo:
      ${caseUpdates}

      Resumo Conciso:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching AI case summary:", error);
    if (error instanceof Error) {
        return `Error generating summary: ${error.message}.`;
    }
    return "An unknown error occurred while generating the AI summary.";
  }
};

export const getAIPredictiveAnalysis = async (caseInfo: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not configured. AI features are unavailable.");
  }
  
  try {
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

    const response = await ai.models.generateContent({
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
          },
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching AI predictive analysis:", error);
    if (error instanceof Error) {
        throw new Error(`Error generating predictive analysis: ${error.message}.`);
    }
    throw new Error("An unknown error occurred while generating the AI analysis.");
  }
};
