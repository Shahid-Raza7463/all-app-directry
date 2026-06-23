import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import renderer, {act} from 'react-test-renderer';
import {
  ProviderStore,
  StoreValue,
  useProviders,
} from '../components/ProviderStore';

let store: StoreValue;

function StoreProbe() {
  store = useProviders();
  return null;
}

const provider = {
  name: 'Test Provider',
  category: 'Doctor',
  phone: '9876543210',
  location: 'Test City',
  experience: 3,
  rating: 4.5,
  photo: '',
  description: 'Local test provider',
};

it('persists add, update and delete operations', async () => {
  const tree = renderer.create(
    <ProviderStore>
      <StoreProbe />
    </ProviderStore>,
  );

  await act(async () => {
    await Promise.resolve();
  });

  act(() => store.addProvider(provider));
  const added = store.providers.find(item => item.name === provider.name);
  expect(added).toBeDefined();
  expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
    '@service-provider-directory/providers',
    expect.stringContaining('Test Provider'),
  );

  act(() => store.updateProvider(added!.id, {...provider, name: 'Updated Provider'}));
  expect(store.providers.find(item => item.id === added!.id)?.name).toBe(
    'Updated Provider',
  );

  act(() => store.deleteProvider(added!.id));
  expect(store.providers.some(item => item.id === added!.id)).toBe(false);

  act(() => tree.unmount());
});
