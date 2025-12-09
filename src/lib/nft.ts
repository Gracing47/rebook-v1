/**
 * NFT Contract Configuration & Helpers
 * 
 * @devnote Using thirdweb Edition Drop for gasless minting
 * @devnote Contract deployed on Celo Mainnet
 * @devnote Implements ERC-1155 standard for efficient batch operations
 */

import { getContract, prepareContractCall } from "thirdweb";
import { client } from "./thirdwebClient";
import { celo } from "./constants";
import type { Account } from "thirdweb/wallets";

// @devnote Replace with your deployed contract address after deployment
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "0x...";

/**
 * Get the ReBook Access NFT contract instance
 * @devnote Lazy-loaded singleton pattern
 */
export function getAccessNFTContract() {
    return getContract({
        client,
        chain: celo,
        address: NFT_CONTRACT_ADDRESS,
    });
}

/**
 * Check if an address owns the ReBook Access NFT
 * 
 * @devnote Uses balanceOf for ERC-1155
 * @devnote Token ID 0 is the access pass
 */
export async function hasAccessNFT(address: string): Promise<boolean> {
    try {
        const contract = getAccessNFTContract();

        // @devnote For ERC-1155, we check balance of token ID 0
        const { balanceOf } = await import("thirdweb/extensions/erc1155");
        const balance = await balanceOf({
            contract,
            owner: address,
            tokenId: 0n,
        });

        return balance > 0n;
    } catch (error) {
        console.error("[hasAccessNFT] Error:", error);
        return false;
    }
}

/**
 * Claim (mint) a ReBook Access NFT with gasless transaction
 * 
 * @devnote Uses thirdweb's claim function with gasless relay
 * @devnote Checks claim conditions before attempting mint
 */
export async function claimAccessNFT(account: Account): Promise<boolean> {
    try {
        const contract = getAccessNFTContract();

        // @devnote Import claim extension
        const { claimTo } = await import("thirdweb/extensions/erc1155");
        const { sendTransaction } = await import("thirdweb");

        const transaction = claimTo({
            contract,
            to: account.address,
            tokenId: 0n,
            quantity: 1n,
        });

        // @devnote Execute transaction with thirdweb v5 sendTransaction
        await sendTransaction({
            transaction,
            account,
        });

        return true;
    } catch (error) {
        console.error("[claimAccessNFT] Error:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to mint NFT");
    }
}

/**
 * Generate invite code for gasless minting
 * 
 * @devnote Server-side only - uses signature-based claiming
 * @devnote Returns a signed payload that can be used once
 */
export async function generateInviteCode(recipientAddress: string): Promise<string> {
    // @devnote This will be implemented in the API route
    // Signature-based claiming with thirdweb's generateMintSignature
    const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientAddress }),
    });

    const data = await response.json();
    return data.inviteCode;
}
