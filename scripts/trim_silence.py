import miniaudio
import wave
import struct

def trim_silence(input_file, output_file, threshold=500):
    info = miniaudio.mp3_get_file_info(input_file)
    stream = miniaudio.decode_file(input_file)
    samples = stream.samples
    sr = info.sample_rate
    ch = info.nchannels
    
    start_idx = 0
    for i in range(0, len(samples), ch):
        if abs(samples[i]) > threshold:
            start_idx = i
            break
            
    # Keep the rest of the file
    trimmed_samples = samples[start_idx:]
    
    with wave.open(output_file, 'wb') as wav:
        wav.setnchannels(ch)
        wav.setsampwidth(2)
        wav.setframerate(sr)
        data = struct.pack('<' + ('h'*len(trimmed_samples)), *trimmed_samples)
        wav.writeframesraw(data)
    
    print(f"Trimmed {start_idx / (sr * ch):.3f} seconds of silence from the start.")
    print("Saved to", output_file)

if __name__ == "__main__":
    trim_silence("d:/Atomlink/public/Assets/Sounds/interface_notification.mp3", 
                 "d:/Atomlink/public/Assets/Sounds/interface_notification_trimmed.wav")
