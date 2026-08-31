import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Sparkles, ArrowRight, Mic, MicOff, Terminal } from 'lucide-react';
import { AIActivityIndicator, TactileButton } from '../ui/TactilePrimitives';

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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-[28px] blur opacity-25 group-hover:opacity-60 transition duration-500 group-focus-within:opacity-80" />

        <div className="relative neo-glass-card p-6 border border-white/20 shadow-2xl flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Sparkles className="w-5.5 h-5.5" />
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
              placeholder="What do you want Orka to accomplish?"
              rows={2}
              className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-lg font-medium outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              {/* Voice button with Cyan activity ring */}
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-2.5 rounded-2xl border transition-all duration-200 ${
                  isVoiceActive
                    ? 'ai-energy-ring bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/10'
                }`}
                title="Voice Dictation"
              >
                {isVoiceActive ? <Mic className="w-4 h-4 text-cyan-300" /> : <MicOff className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 font-mono text-[10px] text-slate-200 shadow-inner">
                  Press Enter ↵
                </span>
                <span className="hidden sm:inline">OrkaAI decomposes intent, plans tools, and requests human sign-off.</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isExecuting ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                  <AIActivityIndicator size="sm" active={true} label="EXECUTING" />
                </div>
              ) : (
                <TactileButton
                  type="submit"
                  disabled={!prompt.trim() || isExecuting}
                  variant="primary"
                  className="px-6 py-2.5 text-sm"
                >
                  <span>Execute Goal</span>
                  <ArrowRight className="w-4 h-4" />
                </TactileButton>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(s);
              startWorkflow(s);
            }}
            className="text-xs px-3.5 py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-cyan-300 transition-all text-left shadow-sm active:scale-98"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
