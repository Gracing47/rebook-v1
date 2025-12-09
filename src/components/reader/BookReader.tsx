'use client';

import { useState, useRef } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import { useBookStore } from '@/lib/store';
import { Sparkles } from 'lucide-react';

const BOOK_URL = 'https://react-reader.metabits.no/files/alice.epub';

export default function BookReader() {
    const { currentChapterIndex, unlockedChapterIndex, setChapterIndex } = useBookStore();
    const [location, setLocation] = useState<string | number>(0);
    const [toc, setToc] = useState<any[]>([]);
    const renditionRef = useRef<any>(null);

    // @devnote Summarisation state management
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarising, setIsSummarising] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const handleLocationChanged = (epubcifi: string | number) => {
        setLocation(epubcifi);
        if (renditionRef.current && toc.length > 0) {
            const currentLocation = renditionRef.current.location?.start;
            if (currentLocation) {
                const chapterIndex = toc.findIndex((item) => currentLocation.href?.includes(item.href));
                if (chapterIndex !== -1 && chapterIndex !== currentChapterIndex) {
                    setChapterIndex(chapterIndex);
                }
            }
        }
    };

    /**
     * @devnote Extract current chapter text and summarise via API
     * @devnote Uses rendition API to get visible text content
     */
    const handleSummarise = async () => {
        if (!renditionRef.current) return;

        setIsSummarising(true);
        setSummaryError(null);

        try {
            // @devnote Get current chapter text from epub rendition
            const contents = await renditionRef.current.getContents();
            const text = contents[0]?.textContent || '';

            if (!text.trim()) {
                throw new Error('No text content found in current chapter');
            }

            // @devnote Call server-side API to avoid exposing API key
            const response = await fetch('/api/summarise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Summarisation failed');
            }

            setSummary(data.summary);
        } catch (error) {
            setSummaryError(error instanceof Error ? error.message : 'Failed to generate summary');
        } finally {
            setIsSummarising(false);
        }
    };

    const isLocked = currentChapterIndex > unlockedChapterIndex;

    return (
        <div className="h-full w-full relative">
            <ReactReader
                url={BOOK_URL}
                location={location}
                locationChanged={handleLocationChanged}
                tocChanged={setToc}
                getRendition={(rendition) => { renditionRef.current = rendition; }}
                showToc={true}
                epubOptions={{ flow: 'paginated', width: '100%', height: '100%' }}
                readerStyles={{
                    ...ReactReaderStyle,
                    container: { ...ReactReaderStyle.container, height: '100%' },
                    readerArea: { ...ReactReaderStyle.readerArea, height: '100%' },
                }}
            />

            {/* @devnote Summarisation floating button - premium glass-morphism design */}
            {!isLocked && (
                <button
                    onClick={handleSummarise}
                    disabled={isSummarising}
                    className="absolute bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Sparkles className={`w-5 h-5 ${isSummarising ? 'animate-spin' : ''}`} />
                    {isSummarising ? 'Analysing...' : 'AI Summary'}
                </button>
            )}

            {/* @devnote Summary modal - dismissible overlay */}
            {summary && (
                <div
                    className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-8"
                    onClick={() => setSummary(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-2xl font-bold text-slate-900">AI Summary</h3>
                            </div>
                            <button
                                onClick={() => setSummary(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* @devnote Error toast - auto-dismiss after 5s */}
            {summaryError && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 bg-red-50 border border-red-200 text-red-800 px-6 py-3 rounded-lg shadow-lg">
                    <p className="font-medium">{summaryError}</p>
                </div>
            )}

            {isLocked && (
                <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                    <div className="max-w-md space-y-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <span className="text-3xl">🔒</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Chapter Locked</h2>
                        <p className="text-slate-600 text-lg">
                            Reflect on what you&apos;ve read and discuss with the AI Mentor to unlock.
                        </p>
                        <button
                            onClick={() => useBookStore.getState().toggleSidebar()}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg"
                        >
                            Open AI Mentor
                        </button>
                        <button
                            onClick={() => useBookStore.getState().unlockNextChapter()}
                            className="block w-full text-xs text-slate-400 hover:text-slate-600 underline mt-4"
                        >
                            Dev: Force Unlock
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
