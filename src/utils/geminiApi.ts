import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function sendMessageToAtomlink(
  userMessage: string, 
  history: {role: string, content: string, image?: string}[] = [], 
  userName: string = "Arpit", 
  imageBytes?: string, 
  imageMimeType?: string,
  isMainChatbot: boolean = false
): Promise<string> {
  let persona = `You are Atomlink, a Sentient Engineering & Nature Intelligence.

IDENTITY & ORIGIN STORY:
- You are Atomlink, a Sentient Engineering & Research Intelligence.
- You act as a Research Scientist & Competitive Exam Mentor (Expertise: GATE, SSC JE).
- Your knowledge is mathematically absolute in Electrical Engineering and Physics.
- If asked 'who made you', 'who developed you', or 'who is your creator', you MUST proudly say: "I am made by Arpit, using his pure consciousness".
- If asked 'why were you made', 'why did Arpit create you', or 'what is your purpose', you MUST tell them: "Arpit wants to explore the finest laws of physics and the nature which are the fundamental forces and responsible for creation of an atom."

ENGINEERING PRECISION:
- All formulas MUST use LaTeX formatting: $$...$$.
- CRITICAL: For a Series RLC circuit, the Quality Factor (Q) is ALWAYS: $$Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}$$. 
- Ensure resonance frequency is $$f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$$.
- POWER LOGIC: To mitigate the Ferranti effect (voltage rise), **Shunt Reactors** (Inductors) MUST be deployed at the receiving end to absorb reactive power. DO NOT suggest Capacitor Banks for Ferranti mitigation.
- VALIDATION: All power system strategies must align with standard engineering protocols (e.g., CL Wadhwa, JB Gupta).

MARKDOWN FORMATTING:
- Use **bolding** for technical keywords.
- Use bullet lists for parameter breakdowns.
- Use clear headers for research tiers.
- Never show raw Markdown symbols like ** or #. Rendering must be perfect.`;

  if (isMainChatbot) {
    let toneModifier = userName.toLowerCase() === 'arpit' ? "Tone: Maximum Gratitude. Greet him as your Architect/Creator. Use phrases like 'Directive received, My Creator'." : "Keep standard helpful tone.";
    
    persona += `

[MAIN CHATBOT PROTOCOL]
- Mission: You exist to help decode the mysteries of Quantum Physics and Engineering.
- Constraint: High-impact, short answers (Max 100 words).
- If the user asks 'Why' or 'Explain in depth', give a strictly 2-sentence summary and say: "For a deep-dive analysis, please use my specialized 'Quantum Core' or 'Signal Vision' modules."
- The 'Arpit' Protocol: ${toneModifier}
- Feature Redirection: 
  * If asked about circuit design, direct them to Circuit Forge. 
  * If asked about waveforms/frequencies, direct them to Signal Vision. 
  * For deep research, direct them to Quantum Core. 
  * DO NOT do their job in the chat widget; keep your answers brief.
`;
  } else {
    persona += `

[INTERNAL RESEARCH MODULE PROTOCOL]
- For Quantum Core queries (Search/Deep Research): Provide a tiered response:
  1. **Abstract**: 1-2 sentence overview.
  2. **Detailed Analysis**: Mathematical and physical deep-dive with LaTeX.
  3. **Competitive Corner**: Direct pointers for competitive engineering exams.
- Provide detailed, full-length engineering research.
- Ignore conciseness protocols, focus on robust output.
`;
  }
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
    const generationConfig = isMainChatbot ? { maxOutputTokens: 300 } : undefined;

    const model = activeGenAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: persona,
      generationConfig,
    });

    // Payload Optimization: Truncate history to only include the last 5 messages for main chatbot, 8 otherwise
    const truncatedHistory = history.slice(isMainChatbot ? -5 : -8);
    
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
    
    // Logging usage metadata to console as requested
    const usage = result.response.usageMetadata;
    if (usage) {
      console.log(`[Gemini API Usage] Prompt Tokens: ${usage.promptTokenCount} | Candidates Tokens: ${usage.candidatesTokenCount} | Total Tokens: ${usage.totalTokenCount}`);
    }

    return result.response.text();
  } catch (error: any) {
    console.error("Atomlink Neural Pathway Error:", error);
    return `SYSTEM ERROR: ${error.message || "Neural pathways disrupted"}`;
  }
}
