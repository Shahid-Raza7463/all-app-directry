import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import {McqStackParamList} from '../../App';
import {useMcq} from './McqStore';
import {dark, light, styles} from './mcqStyles';

type Props = NativeStackScreenProps<McqStackParamList, 'McqHome'>;

const McqHomeScreen = ({navigation}: Props) => {
  const {history, settings} = useMcq();
  const p = settings.theme === 'dark' ? dark : light;
  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: p.bg}]}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={['#7868F4', '#4C3BC4']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SMART STUDY TOOL</Text>
          </View>
          <Text style={styles.heroTitle}>Turn questions into answers.</Text>
          <Text style={styles.heroText}>
            Scan printed MCQs, extract every option, and review predicted
            answers in seconds.
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => navigation.navigate('Scan')}>
            <Feather name="camera" size={18} color="#5143C9" />
            <Text style={styles.scanText}>Scan Questions</Text>
          </TouchableOpacity>
        </LinearGradient>
        <Text style={[styles.sectionTitle, {color: p.ink}]}>
          Your workspace
        </Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionCard,
              {backgroundColor: p.card, borderColor: p.border},
            ]}
            onPress={() => navigation.navigate('History')}>
            <View style={[styles.actionIcon, styles.tealIcon]}>
              <Feather name="clock" size={19} color="#258D83" />
            </View>
            <Text style={[styles.actionTitle, {color: p.ink}]}>History</Text>
            <Text style={[styles.actionMeta, {color: p.text}]}>
              {history.length} saved scans
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionCard,
              {backgroundColor: p.card, borderColor: p.border},
            ]}
            onPress={() => navigation.navigate('Settings')}>
            <View style={[styles.actionIcon, styles.purpleIcon]}>
              <Feather name="sliders" size={19} color={p.primary} />
            </View>
            <Text style={[styles.actionTitle, {color: p.ink}]}>Settings</Text>
            <Text style={[styles.actionMeta, {color: p.text}]}>
              {settings.ocrLanguage} OCR
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.tip,
            {backgroundColor: p.card, borderColor: p.border},
          ]}>
          <Feather name="zap" size={19} color={p.primary} />
          <View style={styles.tipCopy}>
            <Text style={[styles.tipTitle, {color: p.ink}]}>
              For a sharper scan
            </Text>
            <Text style={[styles.tipText, {color: p.text}]}>
              Keep the page flat, use even lighting, and fit all answer options
              inside the frame.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default McqHomeScreen;
