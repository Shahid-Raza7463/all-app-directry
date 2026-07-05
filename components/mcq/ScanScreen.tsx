import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {launchCamera} from 'react-native-image-picker';
import TextRecognition, {
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import Feather from 'react-native-vector-icons/Feather';
import {McqStackParamList} from '../../App';
import {analyzeMcqs} from './mcqAnalyzer';
import {useMcq} from './McqStore';
import {dark, light, styles} from './mcqStyles';

type Props = NativeStackScreenProps<McqStackParamList, 'Scan'>;
const scripts = {
  English: TextRecognitionScript.LATIN,
  Hindi: TextRecognitionScript.DEVANAGARI,
  Japanese: TextRecognitionScript.JAPANESE,
};

const ScanScreen = ({navigation}: Props) => {
  const {saveScan, settings} = useMcq();
  const p = settings.theme === 'dark' ? dark : light;
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const started = useRef(false);

  const scan = useCallback(async () => {
    setError('');
    const capture = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.9,
      maxWidth: 2200,
      maxHeight: 2200,
    });
    if (capture.didCancel) {
      return;
    }
    if (capture.errorCode || !capture.assets?.[0]?.uri) {
      setError(capture.errorMessage ?? 'Camera could not capture the page.');
      return;
    }
    setProcessing(true);
    try {
      const imageUri = capture.assets[0].uri;
      const recognized = await TextRecognition.recognize(
        imageUri,
        scripts[settings.ocrLanguage],
      );
      const answers = analyzeMcqs(recognized.text);
      if (!answers.length) {
        throw new Error(
          'No complete MCQs were detected. Make sure question numbers and options A–D are visible.',
        );
      }
      const id = `${Date.now()}`;
      saveScan({
        id,
        imageUri,
        rawText: recognized.text,
        answers,
        createdAt: new Date().toISOString(),
      });
      navigation.replace('Results', {scanId: id});
    } catch (scanError) {
      setError(
        scanError instanceof Error
          ? scanError.message
          : 'The image could not be analyzed.',
      );
    } finally {
      setProcessing(false);
    }
  }, [navigation, saveScan, settings.ocrLanguage]);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      scan();
    }
  }, [scan]);

  return (
    <View style={[styles.center, {backgroundColor: p.bg}]}>
      <View
        style={[
          styles.scanner,
          {borderColor: p.primary, backgroundColor: p.card},
        ]}>
        <Feather name="file-text" size={50} color={p.primary} />
        {processing && (
          <View style={[styles.scanLine, {backgroundColor: p.cyan}]} />
        )}
      </View>
      <Text style={[styles.processingTitle, {color: p.ink}]}>
        {processing ? 'Reading your questions…' : 'Ready to scan'}
      </Text>
      <Text style={[styles.processingText, {color: p.text}]}>
        {processing
          ? 'OCR is extracting text and identifying answer choices.'
          : 'Capture a clear photo containing one or more MCQs.'}
      </Text>
      {processing ? (
        <ActivityIndicator color={p.primary} style={styles.processingLoader} />
      ) : (
        <TouchableOpacity
          style={[
            styles.scanButton,
            styles.cameraButton,
            {backgroundColor: p.primary},
          ]}
          onPress={scan}>
          <Feather name="camera" size={18} color="#FFF" />
          <Text style={[styles.scanText, styles.whiteText]}>Open Camera</Text>
        </TouchableOpacity>
      )}
      {!!error && (
        <View
          style={[
            styles.errorCard,
            {backgroundColor: p.card, borderColor: p.danger},
          ]}>
          <Feather name="alert-circle" size={18} color={p.danger} />
          <Text style={[styles.errorText, {color: p.danger}]}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default ScanScreen;
