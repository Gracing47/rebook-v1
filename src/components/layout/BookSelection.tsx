'use client';

import { useBookStore } from '@/lib/store';
import { Book } from '@/lib/types';
import { useActiveAccount } from 'thirdweb/react';
import { motion } from 'framer-motion';
import { Sparkles, Wallet } from 'lucide-react';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/lib/thirdwebClient';
import { WALLETS } from '@/lib/wallets';
import AccessGate from '@/components/ui/AccessGate';

// Explicit wallet configuration for better "Wide" modal experience
// Wallets are imported from shared configuration

const BOOKS: Book[] = [
    {
        id: 'art-of-war',
        title: 'The Art of War',
        author: 'Sun Tzu',
        cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
        color: 'from-orange-500 to-red-600',
        epubUrl: 'https://react-reader.metabits.no/files/alice.epub'
    },
    {
        id: 'alice',
        title: 'Alice in Wonderland',
        author: 'Lewis Carroll',
        cover: 'https://covers.openlibrary.org/b/id/8479576-L.jpg',
        color: 'from-blue-500 to-indigo-600',
        epubUrl: 'https://react-reader.metabits.no/files/alice.epub'
    },
    {
        id: 'prince',
        title: 'The Prince',
        author: 'Niccolò Machiavelli',
        cover: 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
        color: 'from-emerald-500 to-teal-600',
        epubUrl: 'https://react-reader.metabits.no/files/alice.epub'
    }
];

export default function BookSelection() {
    const { selectBook } = useBookStore();
    const account = useActiveAccount();

    if (!account) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wallet className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Connect Your Wallet</h2>
                    <p className="text-slate-500 mb-8">
                        Connect to mint insights and unlock knowledge.
                    </p>
                    <ConnectButton
                        client={client}
                        wallets={WALLETS}
                        connectModal={{
                            size: "wide",
                            title: "Join ReBook",
                            welcomeScreen: {
                                title: "Begin Your Journey",
                                subtitle: "Your gateway to knowledge mining.",
                                img: {
                                    src: "https://raw.githubusercontent.com/thirdweb-dev/js/main/packages/react/src/assets/logo.svg",
                                    width: 150,
                                    height: 150,
                                }
                            }
                        }}
                        connectButton={{ label: 'Connect Wallet to Begin' }}
                    />
                </motion.div>
            </div>
        );
    }

    // @devnote NFT-gated access - wrap book selection with AccessGate
    return (
        <AccessGate>
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Book</h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Select a classic. Mine insights. Own your knowledge.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                    {BOOKS.map((book, index) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group cursor-pointer"
                            onClick={() => selectBook(book.id)}
                        >
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
                                <div className={`relative h-64 bg-gradient-to-br ${book.color} flex items-center justify-center p-4`}>
                                    <img
                                        src={book.cover}
                                        alt={book.title}
                                        className="h-52 w-auto object-contain rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4">{book.author}</p>
                                    <div className="flex items-center text-indigo-600 font-medium text-sm">
                                        <Sparkles className="w-4 h-4 mr-1" />
                                        <span>Start Mining</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AccessGate>
    );
}
