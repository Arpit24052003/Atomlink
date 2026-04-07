const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // This doesn't list, it just gets. 
    // genAI.listModels is for listing.
    const models = await genAI.listModels();
    for (const m of models.models) {
      console.log(m.name);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
