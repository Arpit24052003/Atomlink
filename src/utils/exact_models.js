const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.models) {
    data.models.forEach(m => {
        if (m.name.includes('flash') || m.name.includes('lite') || m.name.includes('pro')) {
            console.log(m.name);
        }
    });
  } else {
    console.log("Error:", data);
  }
}

listModels();
