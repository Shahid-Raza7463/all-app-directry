import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const CATEGORIES = [
  'Doctor',
  '4 Wheeler Driver',
  'Auto Driver',
  'Helper',
  'Medicine Shop',
] as const;
export type Provider = {
  id: string;
  name: string;
  category: string;
  phone: string;
  location: string;
  experience: number;
  rating: number;
  photo: string;
  description: string;
};
type ProviderInput = Omit<Provider, 'id'>;
export type StoreValue = {
  providers: Provider[];
  ready: boolean;
  addProvider: (value: ProviderInput) => void;
  updateProvider: (id: string, value: ProviderInput) => void;
  deleteProvider: (id: string) => void;
};
const STORAGE_KEY = '@service-provider-directory/providers';
const initialProviders: Provider[] = [
  {
    id: '1',
    name: 'Dr. Aisha Khan',
    category: 'Doctor',
    phone: '9876543210',
    location: 'Indiranagar, Bengaluru',
    experience: 8,
    rating: 4.9,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300',
    description:
      'General physician providing family care and preventive consultations.',
  },
  {
    id: '2',
    name: 'Ravi Kumar',
    category: '4 Wheeler Driver',
    phone: '9845012345',
    location: 'Koramangala, Bengaluru',
    experience: 10,
    rating: 4.7,
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
    description:
      'Reliable city and outstation driver with a clean driving record.',
  },
  {
    id: '3',
    name: 'Suresh Babu',
    category: 'Auto Driver',
    phone: '9900123456',
    location: 'Jayanagar, Bengaluru',
    experience: 6,
    rating: 4.6,
    photo: '',
    description: 'Local rides, station pickups and scheduled daily commutes.',
  },
  {
    id: '4',
    name: 'Meena Devi',
    category: 'Helper',
    phone: '9988776655',
    location: 'HSR Layout, Bengaluru',
    experience: 5,
    rating: 4.8,
    photo: '',
    description: 'Experienced home helper available for flexible daytime work.',
  },
  {
    id: '5',
    name: 'CarePlus Pharmacy',
    category: 'Medicine Shop',
    phone: '9887766554',
    location: 'BTM Layout, Bengaluru',
    experience: 12,
    rating: 4.7,
    photo: '',
    description:
      'Prescription medicines, wellness essentials and home delivery.',
  },
];
const Context = createContext<StoreValue | null>(null);

export function ProviderStore({children}: {children: React.ReactNode}) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => setProviders(value ? JSON.parse(value) : initialProviders))
      .catch(() => setProviders(initialProviders))
      .finally(() => setReady(true));
  }, []);
  const commit = (update: (current: Provider[]) => Provider[]) => {
    setProviders(current => {
      const next = update(current);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(
        () => undefined,
      );
      return next;
    });
  };
  const value = useMemo<StoreValue>(
    () => ({
      providers,
      ready,
      addProvider: provider =>
        commit(current => [
          {
            ...provider,
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          },
          ...current,
        ]),
      updateProvider: (id, provider) =>
        commit(current =>
          current.map(item => (item.id === id ? {...provider, id} : item)),
        ),
      deleteProvider: id =>
        commit(current => current.filter(item => item.id !== id)),
    }),
    [providers, ready],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useProviders() {
  const value = useContext(Context);
  if (!value) {
    throw new Error('useProviders must be used inside ProviderStore');
  }
  return value;
}
