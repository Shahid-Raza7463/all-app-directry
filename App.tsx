import React from 'react';
import {StatusBar} from 'react-native';
import PdfMergerScreen from './components/PdfMergerScreen';

function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />
      <PdfMergerScreen />
    </>
  );
}

export default App;
