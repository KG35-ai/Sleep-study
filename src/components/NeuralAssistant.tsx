import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Mic, MicOff, Loader2, Zap } from 'lucide-react';

export const NeuralAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are the Sleep Assistant for the Sleep Explorer. You are a world-class sleep specialist. Help the user understand the neural regulation of sleep architecture and pulmonary function. Explain concepts like REM sleep, sleep apnea, respiratory rhythms, and the role of the brainstem in breathing. Keep responses concise, clinical, and engaging. You can hear the user and speak back in real-time.",
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            
            processorRef.current!.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
            sourceRef.current!.connect(processorRef.current!);
            processorRef.current!.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
              const pcmData = new Int16Array(bytes.buffer);
              audioQueue.current.push(pcmData);
              if (!isPlaying.current) playNextInQueue();
            }
            if (message.serverContent?.interrupted) {
              audioQueue.current = [];
              setIsSpeaking(false);
            }
          },
          onclose: () => stopSession(),
          onerror: (err) => {
            console.error("Live API Error:", err);
            stopSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start neural link:", err);
      setIsConnecting(false);
    }
  };

  const playNextInQueue = async () => {
    if (audioQueue.current.length === 0 || !audioContextRef.current) {
      isPlaying.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlaying.current = true;
    setIsSpeaking(true);
    const pcmData = audioQueue.current.shift()!;
    const audioBuffer = audioContextRef.current.createBuffer(1, pcmData.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcmData.length; i++) {
      channelData[i] = pcmData[i] / 0x7FFF;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = playNextInQueue;
    source.start();
  };

  return (
    <div className="flex items-center gap-3 pointer-events-auto">
      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
          isActive 
            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
            : 'glass hover:bg-white/10 text-emerald-400'
        }`}
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isActive ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        <span className="text-xs font-mono uppercase tracking-wider">
          {isConnecting ? 'ESTABLISHING LINK...' : isActive ? 'TERMINATE LINK' : 'ESTABLISH NEURAL LINK'}
        </span>
      </button>

      {isActive && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Zap className={`w-3 h-3 text-emerald-400 ${isSpeaking ? 'animate-pulse' : 'opacity-50'}`} />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isSpeaking ? 'h-3' : 'h-1'}`}
                style={{ 
                  animation: isSpeaking ? `pulse 0.5s ease-in-out infinite ${i * 0.1}s` : 'none'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
