/**
 * Onboarding Wizard Component
 * 
 * @devnote Multi-step form for collecting user reading preferences
 * @devnote Uses framer-motion for premium transitions
 * @devnote Collects data to influence unique generative NFT artwork
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Target, Clock, Sparkles, Check } from 'lucide-react';
import { ReaderProfile } from '@/lib/types';

interface OnboardingWizardProps {
    onComplete: (profile: ReaderProfile) => void;
}

const GENRES = [
    { id: 'Sci-Fi', label: 'Sci-Fi', icon: '🚀', color: 'from-blue-500 to-indigo-600' },
    { id: 'Philosophy', label: 'Philosophy', icon: '🤔', color: 'from-amber-500 to-orange-600' },
    { id: 'Business', label: 'Business', icon: '📈', color: 'from-emerald-500 to-teal-600' },
    { id: 'Fiction', label: 'Fiction', icon: '📚', color: 'from-pink-500 to-rose-600' },
    { id: 'History', label: 'History', icon: '🏛️', color: 'from-stone-500 to-neutral-600' },
    { id: 'Other', label: 'Other', icon: '✨', color: 'from-purple-500 to-violet-600' },
] as const;

const GOALS = [
    { id: 'Growth', label: 'Personal Growth', description: 'Learning to improve myself' },
    { id: 'Entertainment', label: 'Just for Fun', description: 'Reading is my happy place' },
    { id: 'Research', label: 'Deep Research', description: 'Mining specific knowledge' },
    { id: 'Escape', label: 'Escapism', description: 'Getting lost in new worlds' },
] as const;

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState<Partial<ReaderProfile>>({});

    const handleNext = (data: Partial<ReaderProfile>) => {
        const updatedProfile = { ...profile, ...data };
        setProfile(updatedProfile);

        if (step < 3) {
            setStep(step + 1);
        } else {
            onComplete(updatedProfile as ReaderProfile);
        }
    };

    const variants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 },
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
                {[0, 1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 0 && (
                    <StepName
                        key="step0"
                        onNext={(name, lastBook) => handleNext({ name, lastBook })}
                        variants={variants}
                    />
                )}
                {step === 1 && (
                    <StepGenre
                        key="step1"
                        onNext={(favoriteGenre) => handleNext({ favoriteGenre })}
                        variants={variants}
                    />
                )}
                {step === 2 && (
                    <StepGoal
                        key="step2"
                        onNext={(goal) => handleNext({ goal })}
                        variants={variants}
                    />
                )}
                {step === 3 && (
                    <StepPace
                        key="step3"
                        onNext={(pace) => handleNext({ pace })}
                        variants={variants}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Step 1: Name & Last Book ---
function StepName({ onNext, variants }: { onNext: (n: string, b: string) => void, variants: any }) {
    const [name, setName] = useState('');
    const [lastBook, setLastBook] = useState('');

    return (
        <motion.div
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome, Scholar</h2>
                <p className="text-slate-500">Let&apos;s personalize your library card.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">What should we call you?</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Your name or alias"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last book that moved you?</label>
                    <div className="relative">
                        <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={lastBook}
                            onChange={(e) => setLastBook(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Dune, Sapiens..."
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={() => onNext(name, lastBook)}
                disabled={!name || !lastBook}
                className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Continue <ArrowRight className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

// --- Step 2: Genre ---
function StepGenre({ onNext, variants }: { onNext: (g: any) => void, variants: any }) {
    return (
        <motion.div variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Your Favorite Realm?</h2>
                <p className="text-slate-500">This will define your avatar&apos;s aura.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {GENRES.map((genre) => (
                    <button
                        key={genre.id}
                        onClick={() => onNext(genre.id)}
                        className="group relative overflow-hidden p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                        <span className="text-2xl mb-2 block">{genre.icon}</span>
                        <span className="font-medium text-slate-900">{genre.label}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

// --- Step 3: Goal ---
function StepGoal({ onNext, variants }: { onNext: (g: any) => void, variants: any }) {
    return (
        <motion.div variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Why do you read?</h2>
                <p className="text-slate-500">This shapes your knowledge path.</p>
            </div>

            <div className="space-y-3">
                {GOALS.map((goal) => (
                    <button
                        key={goal.id}
                        onClick={() => onNext(goal.id)}
                        className="w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">{goal.label}</div>
                            <div className="text-sm text-slate-500">{goal.description}</div>
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

// --- Step 4: Pace ---
function StepPace({ onNext, variants }: { onNext: (p: string) => void, variants: any }) {
    const paces = ['1-5 books', '6-12 books', '13-24 books', '25+ books'];

    return (
        <motion.div variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Your Reading Pace?</h2>
                <p className="text-slate-500">Books per year on average.</p>
            </div>

            <div className="space-y-3">
                {paces.map((pace) => (
                    <button
                        key={pace}
                        onClick={() => onNext(pace)}
                        className="w-full p-4 rounded-xl bg-slate-50 hover:bg-indigo-600 hover:text-white font-medium text-slate-700 transition-all flex items-center justify-between group"
                    >
                        <span>{pace}</span>
                        <Clock className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
