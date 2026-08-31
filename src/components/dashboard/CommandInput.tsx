import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Sparkles, ArrowRight, Mic, MicOff } from 'lucide-react';
import { GlassPanel, TactileButton, TactileIconButton, AIIndicator } from '../ui/NeoTactileSystem';

export const CommandInput: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { startWorkflow, isExecuting } = useWorkflow();

  const suggestions = [
    "Prepare me for my meeting tomorrow",
    "Clean up my inbox",
    "Summarize today's work",
    "Find everything I need for tomorrow",
    "Follow up with everyone waiting on me",
    "Prepare my daily brief"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;
    startWorkflow(prompt);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isVoiceActive) {
      setIsVoiceActive(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setPrompt(text);
        setIsVoiceActive(false);
      };
      recognition.onerror = () => setIsVoiceActive(false);
      recognition.onend = () => setIsVoiceActive(false);
    } else {
      setIsVoiceActive(false);
      recognition.stop();
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow border background aura */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-700 rounded-[40px] blur-xl opacity-30 group-hover:opacity-60 transition duration-500 group-focus-within:opacity-80 pointer-events-none" />

        <GlassPanel glowEdge={true} className="p-7 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_25px_rgba(34,211,238,0.35)]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="WHAT SHOULD I ACCOMPLISH?"
              rows={2}
              className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-xl font-bold tracking-tight outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              {/* Circular Tactile Microphone Control with Cyan activity ring */}
              <TactileIconButton
                type="button"
                onClick={toggleVoice}
                icon={isVoiceActive ? <Mic className="w-5 h-5 text-cyan-300" /> : <MicOff className="w-5 h-5 text-slate-400" />}
                activeRing={isVoiceActive}
                activeColor="cyan"
                size="md"
                title="Voice Dictation"
              />

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-mono text-[10px] text-slate-200 shadow-inner">
                  Press Enter ↵
                </span>
                <span className="hidden sm:inline font-medium">Decomposes intent, scans context, and executes tools autonomously.</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isExecuting ? (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                  <AIIndicator size="sm" active={true} />
                  <span>EXECUTING WORKFLOW...</span>
                </div>
              ) : (
                <TactileButton
                  type="submit"
                  disabled={!prompt.trim() || isExecuting}
                  variant="primary"
                  size="md"
                  className="px-7 py-3 text-sm shadow-[0_10px_30px_rgba(59,130,246,0.6)]"
                >
                  <span>Execute Goal</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </TactileButton>
              )}
            </div>
          </div>
        </GlassPanel>
      </form>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2.5">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(s);
              startWorkflow(s);
            }}
            className="text-xs px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer font-medium shadow-sm active:scale-98"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
