"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function WalletConnect() {
    return (
        <div className="wallet-adapter-button-trigger">
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-500 !transition-all !rounded-xl !h-10 !px-4" />
        </div>
    );
}
