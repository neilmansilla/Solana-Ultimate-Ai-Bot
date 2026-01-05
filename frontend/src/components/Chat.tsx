"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import Settings from "./Settings";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState("gpt-4-turbo");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg.content,
                    history: history,
                    model: selectedModel
                }),
            });

            if (!res.ok) throw new Error("API Error");

            const data = await res.json();
            const botMsg: Message = { role: "assistant", content: data.content };
            setMessages((prev) => [...prev, botMsg]);
        } catch (e) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not connect to AI backend." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    return (
        <div className="flex flex-col h-screen w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
            <Settings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
            />

            {/* Header */}
            <div className="glass-strong rounded-2xl p-4 mb-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Ultimate AI
                    </h1>
                    <div className="hidden md:flex gap-2">
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">Python</span>
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">Next.js</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleClearChat}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Clear Chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                </div>
            </div>

            {/* Chat Window */}
            <div
                ref={scrollRef}
                className="glass flex-1 rounded-2xl p-4 overflow-y-auto mb-4 space-y-4 shadow-inner"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                        <div className="text-6xl animate-float">🤖</div>
                        <h2 className="text-xl font-medium">How can I help you today?</h2>
                        <p className="text-sm max-w-md">I can write code, search the web, generate images, and more. Just ask!</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex w-full",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[85%] rounded-2xl px-5 py-3 text-sm md:text-base leading-relaxed shadow-md backdrop-blur-md",
                                msg.role === "user"
                                    ? "bg-blue-600/80 text-white rounded-br-none"
                                    : "bg-slate-700/60 text-slate-100 rounded-bl-none border border-slate-600/30"
                            )}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return match ? (
                                            <div className="my-2 rounded-md overflow-hidden bg-black/50 border border-white/10">
                                                <div className="bg-white/5 px-2 py-1 text-xs text-gray-400 border-b border-white/5">{match[1]}</div>
                                                <code className={cn(className, "block p-3 overflow-x-auto")} {...props}>
                                                    {children}
                                                </code>
                                            </div>
                                        ) : (
                                            <code className="bg-black/30 px-1 py-0.5 rounded text-pink-300 font-mono text-xs" {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    img: (props) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img {...props} alt={props.alt || 'Generated Image'} className="rounded-lg my-2 max-w-full border border-white/10 shadow-lg" />
                                    ),
                                    a: (props) => (
                                        <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />
                                    )
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="bg-slate-700/60 rounded-2xl rounded-bl-none px-5 py-3 flex gap-1 items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="glass p-2 rounded-2xl flex gap-2 items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder-slate-400"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-3 font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
