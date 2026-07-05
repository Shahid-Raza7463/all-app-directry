/* eslint-env jest */
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcon');
jest.mock('react-native-vector-icons/Feather', () => 'FeatherIcon');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
}));
jest.mock('@react-native-ml-kit/text-recognition', () => ({
  __esModule: true,
  default: {recognize: jest.fn()},
  TextRecognitionScript: {
    LATIN: 'Latin',
    DEVANAGARI: 'Devanagari',
    JAPANESE: 'Japanese',
  },
}));
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));
jest.mock('@react-native-documents/picker', () => ({
  errorCodes: {OPERATION_CANCELED: 'OPERATION_CANCELED'},
  isErrorWithCode: jest.fn(() => false),
  keepLocalCopy: jest.fn(),
  pick: jest.fn(),
  saveDocuments: jest.fn(),
  types: {pdf: 'application/pdf'},
}));
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/documents',
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  addEventListener: jest.fn(() => ({remove: jest.fn()})),
  removeEventListener: jest.fn(),
  exitApp: jest.fn(),
}));
