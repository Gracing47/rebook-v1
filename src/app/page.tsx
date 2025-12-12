'use client';

import BookReader from '@/components/reader/BookReader';
import { Header } from '@/components/ui/Header';
import AiSidebar from '@/components/ai/AiSidebar';
import BookSelection from '@/components/layout/BookSelection';
import { useBookStore } from '@/lib/store';

export default function Home() {
    const { selectedBookId } = useBookStore();

    return (
        <main className="flex flex-col h-screen bg-slate-50">
            <Header />

            {!selectedBookId ? (
                <BookSelection />
            ) : (
                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Book Reader */}
                    <div className="flex-1 p-4 pb-8 overflow-hidden">
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full overflow-hidden">
                            <BookReader />
                        </div>
                    </div>

                    {/* Right: AI Sidebar - Always visible */}
                    <div className="w-[400px] border-l border-slate-200">
                        <AiSidebar />
                    </div>
                </div>
            )}
        </main>
    );
}
