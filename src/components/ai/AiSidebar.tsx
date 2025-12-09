'use client';

import { useBookStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function AiSidebar() {
    const { isSidebarOpen, toggleSidebar } = useBookStore();
    const [input, setInput] = useState('');
    // We'll hook up Vercel AI SDK later
    const [messages, setMessages] = useState<any[]>([
        { role: 'system', content: 'Welcome to ReBook. I am your AI Mentor. Read the chapter and let\'s discuss insights.' }
    ]);

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

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black z-40 lg:hidden"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-16 bottom-0 w-full md:w-[400px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur">
                            <div className="flex items-center gap-2 text-indigo-700">
                                <Sparkles className="w-5 h-5" />
                                <h2 className="font-semibold">AI Mentor</h2>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'
                                            }`}
                                    >
                                        {m.content}
                                    </div>
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
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
