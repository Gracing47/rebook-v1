// Wallet configuration shared across the app
// Using thirdweb wallet utilities with flexible auth options
import { createWallet, inAppWallet } from "thirdweb/wallets";

export const WALLETS = [
    // In‑app wallet with Google, Email and Passkey authentication
    inAppWallet({
        auth: {
            options: ["google", "email", "passkey"],
        },
    }),
    // External wallets
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
];
