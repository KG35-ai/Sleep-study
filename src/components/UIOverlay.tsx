import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainRegion, brainWaves } from '../data/neuroscience';
import { X, Activity, Brain, Zap, Info, Volume2, Loader2 } from 'lucide-react';
import { generateBrainNarration } from '../services/narrationService';
import { NeuralAssistant } from './NeuralAssistant';

interface UIOverlayProps {
  selectedRegion: BrainRegion | null;
  onCloseRegion: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ selectedRegion, onCloseRegion }) => {
  const [isNarrating, setIsNarrating] = useState(false);

  const handleNarrate = async () => {
    if (isNarrating) return;
    setIsNarrating(true);
    try {
      const topic = selectedRegion 
        ? `${selectedRegion.name} and its role in sleep medicine and respiratory control` 
        : "the neural regulation of sleep architecture and pulmonary function";
      const audioData = await generateBrainNarration(topic);
      
      const audioBlob = await fetch(`data:audio/wav;base64,${audioData}`).then(res => res.blob());
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsNarrating(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error("Failed to play narration:", error);
      setIsNarrating(false);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tighter text-blue-400">
            SLEEP<span className="text-white opacity-50">.EXPLORER</span>
          </h1>
          <p className="text-xs font-mono text-white/40 mt-1 uppercase tracking-widest">
            Neural Respiratory Control & Sleep Architecture Mapping
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-4">
            <button 
              onClick={handleNarrate}
              disabled={isNarrating}
              className={`glass px-4 py-2 rounded-full flex items-center gap-2 transition-all ${isNarrating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
            >
              {isNarrating ? (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-xs font-mono">
                {isNarrating ? 'ANALYZING SLEEP...' : 'NARRATE SLEEP STUDY'}
              </span>
            </button>
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-xs font-mono">RESPIRATORY SYNC: ACTIVE</span>
            </div>
          </div>
          
          {/* Real-time Voice Assistant */}
          <NeuralAssistant />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className="absolute right-8 w-96 glass p-6 rounded-3xl pointer-events-auto border border-blue-500/20"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse" 
                    style={{ backgroundColor: selectedRegion.color }}
                  />
                  <h2 className="text-2xl font-display font-bold">{selectedRegion.name}</h2>
                </div>
                <button 
                  onClick={onCloseRegion}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Neuro-Physiological Function</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {selectedRegion.description}
                  </p>
                </div>

                {selectedRegion.clinical && (
                  <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> Clinical Significance
                    </h3>
                    <p className="text-sm text-blue-100/80 italic leading-relaxed">
                      "{selectedRegion.clinical}"
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Brain className="w-3 h-3" /> Key Sleep/Pulmonary Roles
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedRegion.functions.map((func, i) => (
                      <div key={i} className="bg-white/5 px-3 py-2 rounded-lg text-xs border border-white/5 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                        {func}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                  <Info className="w-3 h-3" />
                  CLINICAL ID: {selectedRegion.id.toUpperCase()}
                </div>
                <button className="text-[10px] font-mono px-3 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                  DIAGNOSTIC SCAN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Wave Data */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="flex gap-2">
          {brainWaves.map((wave) => (
            <div key={wave.type} className="glass p-3 rounded-2xl w-32 group hover:bg-white/10 transition-all cursor-help">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-white/40">{wave.frequency}</span>
                <Brain className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-sm font-bold">{wave.type}</div>
              <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-tighter">{wave.state}</div>
            </div>
          ))}
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono text-white/20 mb-2">SYSTEM STATUS: NOMINAL</div>
          <div className="flex gap-1">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-emerald-500/30 rounded-full"
                style={{ 
                  height: `${Math.random() * 20 + 5}px`,
                  animation: `pulse 1s ease-in-out infinite ${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scaleY(1); opacity: 0.3; }
          50% { transform: scaleY(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
