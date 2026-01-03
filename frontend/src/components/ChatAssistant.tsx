import React, { useState, useRef, useEffect } from 'react';

import { API_URL } from '../config';

const ChatAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
        { role: 'assistant', text: "Hello! I'm monitoring the system logs. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble retrieving the log analysis right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 p-0 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center border border-white/10 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <span className="text-3xl">✨</span>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-28 right-8 w-[400px] h-[600px] glass-panel rounded-2xl flex flex-col z-50 animate-slide-up overflow-hidden ring-1 ring-white/10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 px-6 py-4 border-b border-white/5 flex items-center gap-3 backdrop-blur-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                            🤖
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">AI Log Analyst</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-blue-200/70">Online & Listening</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-lg ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-slate-800/80 text-custom-gray border border-white/5 rounded-2xl rounded-tl-sm backdrop-blur-md'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/50 rounded-2xl p-4 flex gap-2 items-center border border-white/5">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 bg-slate-900/40 border-t border-white/5 backdrop-blur-md">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about 500 errors, latency..."
                                className="w-full bg-slate-950/50 text-white border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-slate-600">AI can make mistakes. Verify important logs.</span>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatAssistant;
