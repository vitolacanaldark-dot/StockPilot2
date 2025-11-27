import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product, Sale } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateInventoryInsights = async (products: Product[], recentSales: Sale[]) => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini");
    return "Chave de API ausente. Configure o ambiente para receber insights da IA.";
  }

  const inventorySummary = products.map(p => 
    `- ${p.name} (SKU: ${p.sku}): ${p.stock} ${p.unit} em estoque. Min: ${p.minStock}. Custo: R$${p.cost}. Preço: R$${p.price}.`
  ).join('\n');

  const salesSummary = recentSales.slice(0, 10).map(s => 
    `- Venda em ${new Date(s.date).toLocaleDateString()}: R$${s.total} (${s.items.length} itens)`
  ).join('\n');

  const prompt = `
    Você é a StockPilot AI, uma especialista em gestão de estoque para pequenos negócios no Brasil.
    Analise o seguinte inventário e dados de vendas recentes.
    
    Inventário:
    ${inventorySummary}

    Vendas Recentes:
    ${salesSummary}

    Por favor, forneça um relatório conciso e acionável em Português do Brasil cobrindo:
    1. **Alertas de Reposição**: Quais itens estão criticamente baixos (baseado no estoque mínimo)?
    2. **Estoque Parado**: Identifique itens que podem estar em excesso (estoque alto vs vendas baixas).
    3. **Oportunidade de Lucro**: Sugira ajustes de preço ou promoções baseados nas margens.
    4. **Previsão**: Uma previsão breve para a próxima semana.

    Formate a resposta em Markdown com cabeçalhos claros. Mantenha um tom profissional e encorajador.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Não foi possível gerar insights no momento. Tente novamente mais tarde.";
  }
};

export const analyzeProductImage = async (base64Image: string): Promise<Partial<Product> | null> => {
   if (!apiKey) return null;

   try {
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: [
         {
            text: "Analise esta imagem de produto. Extraia um nome provável, uma categoria sugerida e uma curta descrição. Retorne APENAS um objeto JSON com as chaves: name, category, description. O conteúdo deve ser em Português."
         },
         {
           inlineData: {
             mimeType: "image/jpeg",
             data: base64Image
           }
         }
       ]
     });

     const text = response.text;
     // Basic cleanup to find JSON block
     const jsonMatch = text.match(/\{[\s\S]*\}/);
     if (jsonMatch) {
       return JSON.parse(jsonMatch[0]);
     }
     return null;
   } catch (e) {
     console.error("Error analyzing image", e);
     return null;
   }
}