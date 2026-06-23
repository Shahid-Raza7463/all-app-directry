/* eslint-env jest */
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcon');
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  addEventListener: jest.fn(() => ({remove: jest.fn()})),
  removeEventListener: jest.fn(),
  exitApp: jest.fn(),
}));
