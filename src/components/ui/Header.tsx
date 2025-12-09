'use client';

import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdwebClient";
import { useBookStore } from "@/lib/store";
import { WALLETS } from "@/lib/wallets";

export function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shadow-sm h-16">
            <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => useBookStore.getState().selectBook(null)}
            >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    RB
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">ReBook</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => useBookStore.getState().toggleSidebar()}
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                    <span className="text-lg">✨</span>
                    Ask Mentor
                </button>
                <ConnectButton
                    client={client}
                    wallets={WALLETS}
                    connectButton={{
                        label: "Connect"
                    }}
                    connectModal={{
                        size: "wide",
                        title: "ReBook Wallet",
                    }}
                />
            </div>
        </header>
    );
}
