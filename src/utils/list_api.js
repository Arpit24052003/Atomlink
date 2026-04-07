const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.models) {
    console.log(data.models.map(m => m.name).filter(name => name.includes('flash') || name.includes('lite')));
  } else {
    console.log("Error:", data);
  }
}

listModels();
