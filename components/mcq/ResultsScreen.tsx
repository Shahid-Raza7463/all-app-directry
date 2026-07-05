import React from 'react';
import {
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
import Feather from 'react-native-vector-icons/Feather';
import {McqStackParamList} from '../../App';
import {McqAnswer} from './mcqTypes';
import {useMcq} from './McqStore';
import {dark, light, styles} from './mcqStyles';

type Props = NativeStackScreenProps<McqStackParamList, 'Results'>;
const answerText = (item: McqAnswer) =>
  `${item.question}\n${item.options
    .map(option => `${option.label}. ${option.text}`)
    .join('\n')}\nAnswer: ${item.answer}\n${item.explanation}`;

const ResultsScreen = ({route}: Props) => {
  const {history, settings} = useMcq();
  const p = settings.theme === 'dark' ? dark : light;
  const scan = history.find(item => item.id === route.params.scanId);
  if (!scan) {
    return (
      <View style={[styles.center, {backgroundColor: p.bg}]}>
        <Text style={[styles.emptyTitle, {color: p.ink}]}>Scan not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{backgroundColor: p.bg}}
      contentContainerStyle={styles.content}>
      <Image
        source={{uri: scan.imageUri}}
        style={styles.sourceImage}
        resizeMode="cover"
      />
      <Text style={[styles.sectionTitle, styles.noTopMargin, {color: p.ink}]}>
        {scan.answers.length} questions detected
      </Text>
      {scan.answers.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.resultCard,
            {backgroundColor: p.card, borderColor: p.border},
          ]}>
          <View style={styles.resultHeader}>
            <View style={[styles.qBadge, {backgroundColor: p.primary}]}>
              <Text style={styles.qBadgeText}>Q{index + 1}</Text>
            </View>
            <Text style={[styles.confidence, {color: p.cyan}]}>
              {item.confidence}% CONFIDENCE
            </Text>
          </View>
          <Text style={[styles.question, {color: p.ink}]}>{item.question}</Text>
          {item.options.map(option => (
            <View
              key={option.label}
              style={[
                styles.option,
                {
                  borderColor: option.label === item.answer ? p.cyan : p.border,
                  backgroundColor:
                    option.label === item.answer ? '#E8FAF7' : p.card,
                },
              ]}>
              <Text
                style={[
                  styles.optionLabel,
                  {color: option.label === item.answer ? '#1E8177' : p.text},
                ]}>
                {option.label}
              </Text>
              <Text
                style={[
                  styles.optionText,
                  {color: option.label === item.answer ? '#255C56' : p.text},
                ]}>
                {option.text}
              </Text>
            </View>
          ))}
          <View style={styles.answerBox}>
            <Text style={styles.answerTitle}>
              PREDICTED ANSWER · {item.answer}
            </Text>
            <Text style={styles.explanation}>{item.explanation}</Text>
          </View>
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[styles.smallButton, {borderColor: p.border}]}
              onPress={() => Clipboard.setString(answerText(item))}>
              <Feather name="copy" size={14} color={p.primary} />
              <Text style={[styles.smallText, {color: p.ink}]}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallButton, {borderColor: p.border}]}
              onPress={() => Share.share({message: answerText(item)})}>
              <Feather name="share-2" size={14} color={p.primary} />
              <Text style={[styles.smallText, {color: p.ink}]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ResultsScreen;
