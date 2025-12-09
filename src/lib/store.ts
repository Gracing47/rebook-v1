import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookState {
    currentChapterIndex: number;
    unlockedChapterIndex: number;
    isSidebarOpen: boolean;
    selectedBookId: string | null;

    // Actions
    setChapterIndex: (index: number) => void;
    selectBook: (bookId: string | null) => void;
    unlockNextChapter: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const useBookStore = create<BookState>()(
    persist(
        (set) => ({
            currentChapterIndex: 0,
            unlockedChapterIndex: 0,
            isSidebarOpen: false,
            selectedBookId: null,

            setChapterIndex: (index) => set((state) => {
                if (index > state.unlockedChapterIndex) {
                    return state;
                }
                return { currentChapterIndex: index };
            }),

            selectBook: (bookId) => set({ selectedBookId: bookId }),

            unlockNextChapter: () => set((state) => ({
                unlockedChapterIndex: state.unlockedChapterIndex + 1
            })),

            toggleSidebar: () => set((state) => ({
                isSidebarOpen: !state.isSidebarOpen
            })),

            setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
        }),
        {
            name: 'rebook-storage', // unique name for localStorage
            partialize: (state) => ({
                currentChapterIndex: state.currentChapterIndex,
                unlockedChapterIndex: state.unlockedChapterIndex,
                selectedBookId: state.selectedBookId
            }),
        }
    )
);
