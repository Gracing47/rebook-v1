'use client';

import { useBookStore } from '@/lib/store';
import { Send, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AiSidebar() {
    const { currentSummary, setSummary } = useBookStore();
    const [input, setInput] = useState('');
    // We'll hook up Vercel AI SDK later
    const [messages, setMessages] = useState<any[]>([
        { role: 'system', content: 'Welcome to ReBook. I am your AI Mentor. Read the chapter and let\'s discuss insights.' }
    ]);

    // Add summary to messages when it changes
    useEffect(() => {
        if (currentSummary) {
            setMessages(prev => {
                // Add summary if not already present
                const hasSummary = prev.some(m => m.type === 'summary');
                if (!hasSummary) {
                    return [...prev, { role: 'assistant', content: currentSummary, type: 'summary' }];
                }
                return prev;
            });
        }
    }, [currentSummary]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Optimistic UI
        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');

        // Simulate thinking
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'That is a fascinating observation. How does it relate to the concept of strategy?' }]);
        }, 1000);
    };

    const handleCloseSummary = () => {
        setSummary(null);
        setMessages(prev => prev.filter(m => m.type !== 'summary'));
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 backdrop-blur">
                <Sparkles className="w-5 h-5 text-indigo-700" />
                <h2 className="font-semibold text-indigo-700">AI Insights</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {m.type === 'summary' ? (
                            <div className="max-w-full w-full bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-indigo-600" />
                                        <h3 className="font-semibold text-indigo-900">AI Summary</h3>
                                    </div>
                                    <button
                                        onClick={handleCloseSummary}
                                        className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-indigo-600" />
                                    </button>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                            </div>
                        ) : (
                            <div
                                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'
                                    }`}
                            >
                                {m.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about this chapter..."
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
