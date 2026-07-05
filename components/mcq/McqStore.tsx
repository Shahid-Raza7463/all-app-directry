import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {AppSettings, ScanRecord} from './mcqTypes';

type McqContextValue = {
  history: ScanRecord[];
  settings: AppSettings;
  loading: boolean;
  saveScan: (scan: ScanRecord) => void;
  deleteScan: (id: string) => void;
  clearHistory: () => void;
  updateSettings: (settings: AppSettings) => void;
};

const HISTORY_KEY = '@mcq_scanner/history';
const SETTINGS_KEY = '@mcq_scanner/settings';
const defaults: AppSettings = {theme: 'light', ocrLanguage: 'English'};
const McqContext = createContext<McqContextValue | undefined>(undefined);

export const McqProvider = ({children}: {children: React.ReactNode}) => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [savedHistory, savedSettings] = await Promise.all([
          AsyncStorage.getItem(HISTORY_KEY),
          AsyncStorage.getItem(SETTINGS_KEY),
        ]);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
        if (savedSettings) {
          setSettings({...defaults, ...JSON.parse(savedSettings)});
        }
      } finally {
        setLoading(false);
        setReady(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  }, [history, ready]);
  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [ready, settings]);

  const value = useMemo<McqContextValue>(
    () => ({
      history,
      settings,
      loading,
      saveScan: scan => setHistory(current => [scan, ...current]),
      deleteScan: id =>
        setHistory(current => current.filter(scan => scan.id !== id)),
      clearHistory: () => setHistory([]),
      updateSettings: setSettings,
    }),
    [history, loading, settings],
  );

  return <McqContext.Provider value={value}>{children}</McqContext.Provider>;
};

export const useMcq = () => {
  const context = useContext(McqContext);
  if (!context) {
    throw new Error('useMcq must be used inside McqProvider');
  }
  return context;
};
