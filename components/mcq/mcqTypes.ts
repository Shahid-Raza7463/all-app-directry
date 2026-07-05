export type McqOption = {label: string; text: string};
export type McqAnswer = {
  id: string;
  question: string;
  options: McqOption[];
  answer: string;
  explanation: string;
  confidence: number;
};
export type ScanRecord = {
  id: string;
  imageUri: string;
  rawText: string;
  answers: McqAnswer[];
  createdAt: string;
};
export type AppSettings = {
  theme: 'light' | 'dark';
  ocrLanguage: 'English' | 'Hindi' | 'Japanese';
};
