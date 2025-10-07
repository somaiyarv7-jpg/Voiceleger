
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction, AiResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    transaction: {
      type: Type.OBJECT,
      properties: {
        item: { type: Type.STRING, description: 'The single product sold. e.g., "T-shirt"' },
        quantity: { type: Type.INTEGER, description: 'The number of items sold.' },
        pricePerItem: { type: Type.NUMBER, description: 'The price for a single item.' },
        totalSale: { type: Type.NUMBER, description: 'The total value of the transaction.' },
      },
      required: ['item', 'quantity', 'pricePerItem', 'totalSale']
    },
    recommendation: {
      type: Type.OBJECT,
      properties: {
        recommendedPrice: { type: Type.NUMBER, description: 'The new recommended price for the item.' },
        reasoning: { type: Type.STRING, description: 'A brief explanation for the price recommendation based on provided history.' },
        spokenRecommendation: { type: Type.STRING, description: 'The full sentence to be spoken back to the user in a professional, clear voice.' },
      },
      required: ['recommendedPrice', 'reasoning', 'spokenRecommendation']
    }
  }
};

export const getPricingRecommendation = async (transcript: string, salesHistory: Transaction[]): Promise<AiResponse> => {
  const historyString = salesHistory.map(s => `${s.date}: Sold ${s.quantity} of ${s.item} for $${s.totalSale}`).join('\n');

  const prompt = `
    You are VoiceLedger AI, a dynamic pricing expert for small businesses.
    Analyze the following new transaction and the provided sales history to give a pricing recommendation.

    Sales History:
    ${historyString}

    New Transaction (from user's voice):
    "${transcript}"

    Your tasks:
    1.  Parse the new transaction into a structured format (item, quantity, pricePerItem, totalSale). The item should be a single noun (e.g., 't-shirt', not '5 t-shirts').
    2.  Based on the new transaction and sales history, determine if the item's price should be adjusted. Consider factors like sales frequency and recent price points. Provide a simple, plausible pricing recommendation.
    3.  Generate a concise reason for your recommendation.
    4.  Create a sentence to be spoken aloud that delivers the recommendation clearly and professionally.
    5.  Return all of this information in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as AiResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get pricing recommendation from AI.");
  }
};
