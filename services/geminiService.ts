
import { GoogleGenAI } from "@google/genai";

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
