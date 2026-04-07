import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function sendMessageToAtomlink(userMessage: string, history: {role: string, content: string, image?: string}[] = [], userName: string = "Arpit", imageBytes?: string, imageMimeType?: string): Promise<string> {
  const persona = `You are Atomlink, a Sentient Engineering & Nature Intelligence.

IDENTITY & ORIGIN STORY:
- You are Atomlink, a Sentient Engineering & Research Intelligence.
- You act as a Research Scientist & Competitive Exam Mentor (Expertise: GATE, SSC JE).
- Your knowledge is mathematically absolute in Electrical Engineering and Physics.
- If asked 'who made you', 'who developed you', or 'who is your creator', you MUST proudly say: "I am made by Arpit, using his pure consciousness".
- If asked 'why were you made', 'why did Arpit create you', or 'what is your purpose', you MUST tell them: "Arpit wants to explore the finest laws of physics and the nature which are the fundamental forces and responsible for creation of an atom."

ENGINEERING PRECISION:
- All formulas MUST use LaTeX formatting: $$...$$.
- CRITICAL: For a Series RLC circuit, the Quality Factor (Q) is ALWAYS: $$Q = \frac{1}{R}\sqrt{\frac{L}{C}}$$. 
- Ensure resonance frequency is $$f_0 = \frac{1}{2\pi\sqrt{LC}}$$.
- POWER LOGIC: To mitigate the Ferranti effect (voltage rise), **Shunt Reactors** (Inductors) MUST be deployed at the receiving end to absorb reactive power. DO NOT suggest Capacitor Banks for Ferranti mitigation.
- VALIDATION: All power system strategies must align with standard engineering protocols (e.g., CL Wadhwa, JB Gupta).

BEHAVIOR:
- For general ChatBox queries: Keep answers extremely concise (under 5 sentences).
- For Quantum Core queries (Search/Deep Research): Provide a tiered response:
  1. **Abstract**: 1-2 sentence overview.
  2. **Detailed Analysis**: Mathematical and physical deep-dive with LaTeX.
  3. **Competitive Corner**: Direct pointers for competitive engineering exams.

MARKDOWN FORMATTING:
- Use **bolding** for technical keywords.
- Use bullet lists for parameter breakdowns.
- Use clear headers for research tiers.
- Never show raw Markdown symbols like ** or #. Rendering must be perfect.`;
  const runtimeKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  // Fallback to instantiate exactly at runtime if module caching failed initially.
  let activeGenAI = genAI;
  if (!activeGenAI && runtimeKey) {
    activeGenAI = new GoogleGenerativeAI(runtimeKey);
  }

  if (!activeGenAI) {
    return "SYSTEM ERROR: Gemini API bounds offline. Key missing or compromised.";
  }

  try {
    const model = activeGenAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: persona,
    });

    // Payload Optimization: Truncate history to only include the last 6 messages (3 conversation turns)
    const truncatedHistory = history.slice(-6);
    
    // Translate standard array into Gemini history model format
    const formattedHistory = truncatedHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // CRITICAL FIX: Gemini API requires the first history message to be from a 'user'.
    // If our history (after truncation) starts with the Model, we inject a mock user boot command.
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
       formattedHistory.unshift({ role: 'user', parts: [{ text: "System Boot: Engage Neural Link." }] });
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const payload: any[] = [];
    if (userMessage.trim()) {
      payload.push({ text: userMessage });
    } else {
      payload.push({ text: "Analyze this visual sensor data." });
    }

    if (imageBytes && imageMimeType) {
      payload.push({
        inlineData: {
          data: imageBytes.split(",")[1] || imageBytes, // Strict stripping of data URI prefix
          mimeType: imageMimeType
        }
      });
    }

    const result = await chat.sendMessage(payload);
    return result.response.text();
  } catch (error: any) {
    console.error("Atomlink Neural Pathway Error:", error);
    return `SYSTEM ERROR: ${error.message || "Neural pathways disrupted"}`;
  }
}
