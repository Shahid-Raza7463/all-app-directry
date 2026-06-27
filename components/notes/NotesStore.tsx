import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Note = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type NotesContextValue = {
  notes: Note[];
  loading: boolean;
  addNote: (title: string, description: string) => string;
  updateNote: (id: string, title: string, description: string) => void;
  deleteNote: (id: string) => void;
};

const STORAGE_KEY = '@notes_app/notes';
const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider = ({children}: {children: React.ReactNode}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setNotes(JSON.parse(stored));
        }
      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
        setReady(true);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, ready]);

  const value = useMemo<NotesContextValue>(
    () => ({
      notes,
      loading,
      addNote: (title, description) => {
        const now = new Date().toISOString();
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setNotes(current => [
          {
            id,
            title: title.trim(),
            description: description.trim(),
            createdAt: now,
            updatedAt: now,
          },
          ...current,
        ]);
        return id;
      },
      updateNote: (id, title, description) =>
        setNotes(current =>
          current.map(note =>
            note.id === id
              ? {
                  ...note,
                  title: title.trim(),
                  description: description.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : note,
          ),
        ),
      deleteNote: id =>
        setNotes(current => current.filter(note => note.id !== id)),
    }),
    [loading, notes],
  );

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used inside NotesProvider');
  }
  return context;
};
