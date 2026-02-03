import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private inputNode: ScriptProcessorNode | null = null;
  private outputNode: GainNode | null = null;
  private mediaStream: MediaStream | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async connect(onMessage: (text: string) => void, onStatusChange: (active: boolean) => void) {
    try {
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      this.outputNode = this.outputAudioContext.createGain();
      this.outputNode.connect(this.outputAudioContext.destination);

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a knowledgeable scientific research partner. Keep responses concise and academic but conversational.',
        },
      };

      this.sessionPromise = this.ai.live.connect({
        model: config.model,
        callbacks: {
          onopen: () => {
            console.log("Live session opened");
            onStatusChange(true);
            this.startAudioInput();
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              await this.playAudioChunk(base64Audio);
            }
            
            // Handle Interruption
            if (message.serverContent?.interrupted) {
                this.stopAudioPlayback();
            }

            // Note: Transcription would go here if enabled in config
          },
          onclose: () => {
            console.log("Live session closed");
            onStatusChange(false);
          },
          onerror: (err) => {
            console.error("Live session error", err);
            onStatusChange(false);
          }
        },
        config: config.config,
      });

      await this.sessionPromise;
    } catch (error) {
      console.error("Failed to connect to Live API", error);
      onStatusChange(false);
      throw error;
    }
  }

  private startAudioInput() {
    if (!this.inputAudioContext || !this.mediaStream) return;

    const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
    // Use ScriptProcessor for simplicity in this demo environment, though AudioWorklet is preferred for prod
    this.inputNode = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
    
    this.inputNode.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmData = this.floatTo16BitPCM(inputData);
      const base64Data = this.arrayBufferToBase64(pcmData);

      this.sessionPromise?.then((session) => {
        session.sendRealtimeInput({
          media: {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Data
          }
        });
      });
    };

    source.connect(this.inputNode);
    this.inputNode.connect(this.inputAudioContext.destination);
  }

  private async playAudioChunk(base64Audio: string) {
    if (!this.outputAudioContext || !this.outputNode) return;

    try {
      const arrayBuffer = this.base64ToArrayBuffer(base64Audio);
      // We need to decode manually essentially or wrap in a way AudioContext accepts. 
      // The Gemini API returns raw PCM usually for WebSocket, but here it depends on the "Modality".
      // The specific Live API example uses a custom PCM decoder. 
      // For this implementation, let's try assuming the example helper 'decodeAudioData' logic which handles raw PCM.
      
      // Since I cannot import the exact helper from the prompt instructions easily without bloating,
      // I will implement the raw PCM decode here.
      
      const audioBuffer = await this.pcmToAudioBuffer(arrayBuffer, this.outputAudioContext);
      
      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputNode);
      
      // Schedule playback
      const currentTime = this.outputAudioContext.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }
      
      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      
      this.sources.add(source);
      source.onended = () => this.sources.delete(source);
      
    } catch (e) {
      console.error("Error playing audio chunk", e);
    }
  }

  private stopAudioPlayback() {
    this.sources.forEach(source => {
        try { source.stop(); } catch(e) {}
    });
    this.sources.clear();
    this.nextStartTime = 0; // Reset timing
  }

  async disconnect() {
    if (this.sessionPromise) {
        const session = await this.sessionPromise;
        // session.close() is not explicitly in the typed interface usually, 
        // but we stop sending audio and close contexts.
        // There is no explicit 'close' method on the session object in some versions, 
        // but closing the socket or stopping audio is enough.
    }
    
    this.inputNode?.disconnect();
    this.inputNode = null;
    
    this.mediaStream?.getTracks().forEach(track => track.stop());
    this.mediaStream = null;

    this.inputAudioContext?.close();
    this.outputAudioContext?.close();
    
    this.inputAudioContext = null;
    this.outputAudioContext = null;
    this.sessionPromise = null;
  }

  // --- Helpers ---

  private floatTo16BitPCM(input: Float32Array): ArrayBuffer {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private async pcmToAudioBuffer(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const sampleRate = 24000; // Gemini Live usually outputs 24kHz
    const numChannels = 1;
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
  }
}
