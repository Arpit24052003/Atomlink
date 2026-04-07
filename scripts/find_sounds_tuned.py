import miniaudio
import sys

def find_sounds(file_path):
    stream = miniaudio.decode_file(file_path)
    
    threshold = 1000
    is_playing = False
    start_idx = 0
    
    sounds = []
    
    silence_count = 0
    required_silence = stream.sample_rate * stream.nchannels * 0.05  # 50ms of silence
    
    samples = stream.samples
    for i in range(0, len(samples), stream.nchannels):
        val = abs(samples[i])
        
        if val > threshold:
            if not is_playing:
                start_idx = i
                is_playing = True
            silence_count = 0
        else:
            if is_playing:
                silence_count += stream.nchannels
                if silence_count > required_silence:
                    end_idx = i - int(required_silence)
                    start_time = start_idx / (stream.sample_rate * stream.nchannels)
                    end_time = end_idx / (stream.sample_rate * stream.nchannels)
                    
                    if end_time - start_time > 0.1: # Must be longer than 100ms
                         sounds.append((start_time, end_time))
                    is_playing = False
                    
                    if len(sounds) >= 20:
                         break

    for idx, (st, et) in enumerate(sounds):
        print(f"Index {idx+1}: Start {st:.2f}s - Duration {et-st:.2f}s")
        
    print("Writing slice 1 and 2 to WAV files...")

if __name__ == "__main__":
    find_sounds("d:/Atomlink/public/Assets/Sounds/Ui.mp3")
