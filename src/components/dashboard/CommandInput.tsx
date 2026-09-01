import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ArrowRight, Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/Button';

export const CommandInput: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { startWorkflow, isExecuting } = useWorkflow();

  const suggestions = [
    "Prepare me for my meeting tomorrow",
    "Clean up my inbox",
    "Summarize today's work",
    "Follow up with everyone waiting on me"
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
    <div className="w-full space-y-2.5">
      <form onSubmit={handleSubmit} className="p-4 rounded-lg bg-background-card border border-border-subtle space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="What would you like OrkaAI to handle?"
          rows={2}
          className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm font-medium outline-none resize-none"
        />

        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isVoiceActive ? 'text-rose-600 bg-rose-50' : 'text-text-muted hover:text-text-primary'
              }`}
              title="Voice dictation"
            >
              {isVoiceActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>
            <span className="hidden sm:inline text-[11px]">Press Enter to run</span>
          </div>

          <Button
            type="submit"
            disabled={!prompt.trim() || isExecuting}
            isLoading={isExecuting}
            variant="primary"
            size="sm"
          >
            <span>Run task</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(s);
              startWorkflow(s);
            }}
            className="text-[11px] px-2.5 py-1 rounded bg-background-card hover:bg-background-elevated border border-border-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
