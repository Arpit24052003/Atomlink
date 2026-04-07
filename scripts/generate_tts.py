import os
import asyncio
import edge_tts

text = "Haay, main Atom Link hoon—Arpit dwara nirmit ek jeevant AI. Main vigyan aur engineering ke rahasyon ko suljhaati hoon. Aaj aap kya research karna chahenge?"

output_path = os.path.join("d:\\Atomlink", "public", "Assets", "Sounds", "Jeevant_AI.mp3")
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Using Microsoft's highly natural Neural voice for Hindi
voice = "hi-IN-SwaraNeural"
# +10% rate for clear but brisk articulation
rate = "+10%"
# +10Hz pitch makes the voice inherently sweeter and softer
pitch = "+10Hz"

async def generate():
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await communicate.save(output_path)

if __name__ == "__main__":
    asyncio.run(generate())
    print(f"Successfully generated High-Definition Natural Asset: {output_path}")
