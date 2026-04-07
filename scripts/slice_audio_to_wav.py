import miniaudio
import wave
import struct

def write_wav(filename, samples, sample_rate, channels):
    with wave.open(filename, 'wb') as wav:
        wav.setnchannels(channels)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        data = struct.pack('<' + ('h'*len(samples)), *samples)
        wav.writeframesraw(data)

def extract_sounds():
    file_path = "d:/Atomlink/public/Assets/Sounds/Ui.mp3"
    info = miniaudio.mp3_get_file_info(file_path)
    stream = miniaudio.decode_file(file_path)
    samples = stream.samples
    
    sr = info.sample_rate
    ch = info.nchannels
    
    # Extract Click (Index 2 - trying a different UI element)
    start_time = 2.05
    duration = 0.82
    start_click = int(start_time * sr * ch)
    end_click = int((start_time + duration) * sr * ch)
    write_wav("d:/Atomlink/public/Assets/Sounds/ui_click.wav", samples[start_click:end_click], sr, ch)
    print("Exported ui_click.wav (new index 2)")
    
    # Extract Modal Appear (Index 6 - satisfying UI appear tone)
    start_time = 5.03
    duration = 0.85
    start_mod = int(start_time * sr * ch)
    end_mod = int((start_time + duration) * sr * ch)
    write_wav("d:/Atomlink/public/Assets/Sounds/ui_modal.wav", samples[start_mod:end_mod], sr, ch)
    print("Exported ui_modal.wav")

    # Extract Whoosh transition (Index 12 - long 2.21s transition sound)
    start_time = 12.50
    duration = 2.21
    start_whoosh = int(start_time * sr * ch)
    end_whoosh = int((start_time + duration) * sr * ch)
    write_wav("d:/Atomlink/public/Assets/Sounds/ui_whoosh.wav", samples[start_whoosh:end_whoosh], sr, ch)
    print("Exported ui_whoosh.wav")

if __name__ == "__main__":
    extract_sounds()
