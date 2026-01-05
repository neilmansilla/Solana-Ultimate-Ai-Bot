"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletConnect from "./WalletConnect";

export default function Dashboard() {
    const { publicKey } = useWallet();
    const [strategy, setStrategy] = useState("conservative");

    return (
        <div className="glass-strong rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                    Solana Dashboard
                </h2>
                <WalletConnect />
            </div>

            {!publicKey ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 p-4">
                    <p className="mb-2">Connect your wallet to access earnings and strategies.</p>
                </div>
            ) : (
                <div className="space-y-6 overflow-y-auto pr-2">
                    {/* Access Card */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">Wallet Address</p>
                        <p className="text-sm font-mono text-green-300 truncate">{publicKey.toBase58()}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                            <p className="text-xs text-slate-400 mb-1">Estimated P&L</p>
                            <p className="text-xl font-bold text-green-400">+$124.50</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                            <p className="text-xs text-slate-400 mb-1">Open Positions</p>
                            <p className="text-xl font-bold text-blue-400">3</p>
                        </div>
                    </div>

                    {/* Strategy Selector */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <h3 className="text-sm font-medium text-white mb-3">Active Strategy</h3>
                        <div className="flex gap-2">
                            {["conservative", "balanced", "degen"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStrategy(s)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${strategy === s
                                            ? "bg-blue-600 text-white shadow-lg scale-105"
                                            : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 text-xs text-slate-400">
                            {strategy === "conservative" && "Low risk. Focus on stablecoins and blue chips."}
                            {strategy === "balanced" && "Medium risk. Mix of major tokens and trending alts."}
                            {strategy === "degen" && "High risk. Ape into new mints and high volatility tokens."}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <h3 className="text-sm font-medium text-white mb-3">Agent Activity</h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between text-xs">
                                <span className="text-slate-300">Bought SOL</span>
                                <span className="text-slate-500">2 mins ago</span>
                            </li>
                            <li className="flex justify-between text-xs">
                                <span className="text-slate-300">Analyzed $BONK</span>
                                <span className="text-slate-500">15 mins ago</span>
                            </li>
                            <li className="flex justify-between text-xs">
                                <span className="text-slate-300">Trailing Stop Triggered</span>
                                <span className="text-slate-500">1h ago</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
