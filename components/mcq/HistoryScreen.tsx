import React, {useMemo, useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {McqStackParamList} from '../../App';
import {useMcq} from './McqStore';
import {dark, light, styles} from './mcqStyles';

type Props = NativeStackScreenProps<McqStackParamList, 'History'>;

const HistoryScreen = ({navigation}: Props) => {
  const {history, settings, deleteScan, clearHistory} = useMcq();
  const p = settings.theme === 'dark' ? dark : light;
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return history.filter(
      scan => !term || scan.rawText.toLowerCase().includes(term),
    );
  }, [history, query]);
  const clear = () =>
    Alert.alert('Clear all history?', 'Every saved scan will be deleted.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Clear all', style: 'destructive', onPress: clearHistory},
    ]);

  return (
    <View style={[styles.safe, {backgroundColor: p.bg}]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View
          style={[
            styles.search,
            {backgroundColor: p.card, borderColor: p.border},
          ]}>
          <Feather name="search" size={18} color={p.text} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search scanned questions"
            placeholderTextColor={p.text}
            style={[styles.searchInput, {color: p.ink}]}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={18} color={p.text} />
            </TouchableOpacity>
          )}
        </View>
        {!!history.length && (
          <TouchableOpacity
            style={[styles.clearButton, {borderColor: p.danger}]}
            onPress={clear}>
            <Text style={[styles.clearText, {color: p.danger}]}>
              Clear all history
            </Text>
          </TouchableOpacity>
        )}
        {!filtered.length ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, {backgroundColor: p.card}]}>
              <Feather name="archive" size={31} color={p.primary} />
            </View>
            <Text style={[styles.emptyTitle, {color: p.ink}]}>
              {query ? 'No matching scans' : 'No scan history'}
            </Text>
            <Text style={[styles.emptyText, {color: p.text}]}>
              Your analyzed MCQs will be saved here for quick revision.
            </Text>
          </View>
        ) : (
          filtered.map(scan => (
            <TouchableOpacity
              key={scan.id}
              style={[
                styles.historyCard,
                {backgroundColor: p.card, borderColor: p.border},
              ]}
              onPress={() => navigation.navigate('Results', {scanId: scan.id})}>
              <View style={styles.historyTop}>
                <View style={[styles.historyIcon, styles.purpleIcon]}>
                  <Feather name="file-text" size={18} color={p.primary} />
                </View>
                <View style={styles.historyCopy}>
                  <Text
                    style={[styles.historyTitle, {color: p.ink}]}
                    numberOfLines={1}>
                    {scan.answers[0]?.question ?? 'MCQ scan'}
                  </Text>
                  <Text style={[styles.historyMeta, {color: p.text}]}>
                    {scan.answers.length} questions ·{' '}
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  accessibilityLabel="Delete scan"
                  onPress={() => deleteScan(scan.id)}>
                  <Feather name="trash-2" size={17} color={p.danger} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;
