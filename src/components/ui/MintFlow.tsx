import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import { claimAccessNFT } from '@/lib/nft';
import { useActiveAccount } from 'thirdweb/react';
import OnboardingWizard from '../onboarding/OnboardingWizard';
import { ReaderProfile } from '@/lib/types';

interface MintFlowProps {
    onSuccess: () => void;
}

export default function MintFlow({ onSuccess }: MintFlowProps) {
    const account = useActiveAccount();
    const [step, setStep] = useState<'onboarding' | 'preview' | 'minting'>('onboarding');
    const [profile, setProfile] = useState<ReaderProfile | null>(null);

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProfileComplete = async (readerProfile: ReaderProfile) => {
        setProfile(readerProfile);
        await generateArt(readerProfile);
    };

    const generateArt = async (readerProfile: ReaderProfile) => {
        setIsGenerating(true);
        setStep('preview');
        setError(null);

        try {
            const response = await fetch('/api/generate-nft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: readerProfile.name, // Fallback
                    profile: readerProfile
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to generate art');

            setGeneratedImage(data.imageUrl);
        } catch (err) {
            setError('Failed to generate artwork. Please try again.');
            console.error(err);
            setStep('onboarding'); // Go back on error
        } finally {
            setIsGenerating(false);
        }
    };

    const handleMint = async () => {
        if (!account) return;

        setStep('minting');
        setError(null);

        try {
            await claimAccessNFT(account);
            onSuccess();
        } catch (err: any) {
            console.error(err);
            // Clean up error message
            const msg = err.message || 'Minting failed';
            if (msg.includes('insufficient funds')) {
                setError('Insufficient gas. Please ensure you have CELO for gas fees.');
            } else {
                setError('Minting failed. Please try again.');
            }
            setStep('preview');
        }
    };

    if (!account) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
                <div className="bg-indigo-50 p-6 rounded-full mb-6">
                    <Sparkles className="w-12 h-12 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Wallet to Begin</h2>
                <p className="text-slate-600 max-w-md">
                    Connect your wallet to start your knowledge mining journey and check your access status.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
            >
                <AnimatePresence mode="wait">
                    {/* Step 1: Onboarding Wizard */}
                    {step === 'onboarding' && (
                        <motion.div
                            key="onboarding"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <OnboardingWizard onComplete={handleProfileComplete} />
                        </motion.div>
                    )}

                    {/* Step 2: Generating / Preview */}
                    {step === 'preview' && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Scholar Identity</h2>
                            <p className="text-slate-500 mb-8">Forged from your reading DNA.</p>

                            <div className="relative w-64 h-64 mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-indigo-50">
                                {isGenerating ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                        <div className="text-center">
                                            <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-2" />
                                            <p className="text-sm text-slate-500">Weaving magic...</p>
                                        </div>
                                    </div>
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={generatedImage!} alt="My Access Pass" className="w-full h-full object-cover" />
                                )}
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleMint}
                                    disabled={isGenerating}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    {isGenerating ? 'Generating...' : 'Claim Free Access Pass'}
                                </button>

                                {!isGenerating && (
                                    <button
                                        onClick={() => setStep('onboarding')}
                                        className="flex items-center justify-center gap-2 w-full py-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Not your vibe? Retake quiz
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Minting */}
                    {step === 'minting' && (
                        <motion.div
                            key="minting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <Wand2 className="w-10 h-10 text-indigo-600 animate-bounce" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Minting your Pass...</h2>
                            <p className="text-slate-500">Securing your identity on the blockchain.</p>
                            <p className="text-xs text-slate-400 mt-4">Confirm the transaction in your wallet</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
