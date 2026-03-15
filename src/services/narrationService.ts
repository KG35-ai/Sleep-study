import { GoogleGenAI, Modality } from "@google/genai";

export const generateBrainNarration = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `Provide a short, fascinating clinical insight (about 2-3 sentences) into the neural control of sleep and respiration, specifically focusing on ${topic}. 
  Incorporate concepts from sleep medicine, such as sleep architecture, respiratory rhythms, and autonomic regulation. 
  Speak in a professional, clinical, yet engaging medical tone.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    throw new Error("No audio data received");
  } catch (error) {
    console.error("Narration Error:", error);
    throw error;
  }
};
