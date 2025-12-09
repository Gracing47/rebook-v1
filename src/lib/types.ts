// Shared TypeScript types for the ReBook app
export interface Book {
    id: string;
    title: string;
    author: string;
    cover: string;
    color: string;
    epubUrl: string;
}

export interface ReaderProfile {
    name: string;
    lastBook: string;
    favoriteGenre: 'Sci-Fi' | 'Philosophy' | 'Business' | 'Fiction' | 'History' | 'Other';
    goal: 'Growth' | 'Entertainment' | 'Research' | 'Escape';
    pace: string;
}
