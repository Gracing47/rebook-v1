/**
 * Access Gate Component
 * 
 * @devnote Wrapper component that controls access based on NFT ownership
 * @devnote Shows mint UI if user doesn't own the access NFT
 * @devnote Automatically checks on wallet connection/change
 */

'use client';

import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { hasAccessNFT } from '@/lib/nft';
import MintFlow from './MintFlow';

interface AccessGateProps {
    children: React.ReactNode;
}

export default function AccessGate({ children }: AccessGateProps) {
    const account = useActiveAccount();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    // @devnote Check NFT ownership on account change
    useEffect(() => {
        async function checkAccess() {
            if (!account) {
                setHasAccess(false);
                setIsChecking(false);
                return;
            }

            setIsChecking(true);
            try {
                const access = await hasAccessNFT(account.address);
                setHasAccess(access);
            } catch (error) {
                console.error('[AccessGate] Error checking access:', error);
                setHasAccess(false);
            } finally {
                setIsChecking(false);
            }
        }

        checkAccess();
    }, [account?.address]);

    // @devnote Loading state
    if (isChecking) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                    <p className="text-slate-600">Checking access...</p>
                </div>
            </div>
        );
    }

    // @devnote No access - show mint flow
    if (!hasAccess) {
        return <MintFlow onSuccess={() => setHasAccess(true)} />;
    }

    // @devnote Access granted - render children
    return <>{children}</>;
}
