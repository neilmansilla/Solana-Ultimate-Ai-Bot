"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Model {
    id: string;
    name: string;
}

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    selectedModel: string;
    onModelChange: (modelId: string) => void;
}

export default function Settings({ isOpen, onClose, selectedModel, onModelChange }: SettingsProps) {
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetch("http://localhost:8000/models")
                .then((res) => res.json())
                .then((data) => {
                    setModels(data.models);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch models", err);
                    setIsLoading(false);
                });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-white mb-6">Settings</h2>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">AI Model</label>
                        <select
                            value={selectedModel}
                            onChange={(e) => onModelChange(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <option>Loading models...</option>
                            ) : (
                                models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))
                            )}
                        </select>
                        <p className="text-xs text-slate-500">
                            Select the brain powering your assistant.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <h3 className="text-sm font-medium text-slate-300 mb-2">Capabilities</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Web Search
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Image Generation
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Code Execution
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Python Analysis
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
