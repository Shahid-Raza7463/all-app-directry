import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type TodoContextValue = {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string, description: string) => void;
  updateTask: (id: string, title: string, description: string) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
};

const STORAGE_KEY = '@todo_app/tasks';
const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const TodoProvider = ({children}: {children: React.ReactNode}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {setTasks(JSON.parse(stored));}
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
        setReady(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (ready) {AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));}
  }, [ready, tasks]);

  const value = useMemo<TodoContextValue>(
    () => ({
      tasks,
      loading,
      addTask: (title, description) => {
        const now = new Date().toISOString();
        setTasks(current => [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: title.trim(),
            description: description.trim(),
            completed: false,
            createdAt: now,
            updatedAt: now,
          },
          ...current,
        ]);
      },
      updateTask: (id, title, description) =>
        setTasks(current =>
          current.map(task =>
            task.id === id
              ? {
                  ...task,
                  title: title.trim(),
                  description: description.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        ),
      deleteTask: id =>
        setTasks(current => current.filter(task => task.id !== id)),
      toggleTask: id =>
        setTasks(current =>
          current.map(task =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        ),
    }),
    [loading, tasks],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {throw new Error('useTodos must be used inside TodoProvider');}
  return context;
};
