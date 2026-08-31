import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Sparkles, ArrowRight, CornerDownLeft, Play } from 'lucide-react';

export const CommandInput: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const { startWorkflow, isExecuting, launchDemoScenario } = useWorkflow();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;
    startWorkflow(prompt);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow border background */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-violet-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500 group-focus-within:opacity-100" />

        <div className="relative bg-[#12141d]/90 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="w-4 h-4" />
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
              placeholder='What do you want me to take care of? e.g. "Prepare me for my Acme meeting tomorrow."'
              rows={2}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-lg font-medium outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">Press Enter ↵</span>
              <span>ActionOS will plan, run tools, and request approval if sensitive.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={launchDemoScenario}
                className="px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Try Acme Meeting Demo</span>
              </button>

              <button
                type="submit"
                disabled={!prompt.trim() || isExecuting}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm transition-all active:scale-95"
              >
                <span>Run</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
