import React from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useMcq} from './McqStore';
import {AppSettings} from './mcqTypes';
import {dark, light, styles} from './mcqStyles';

const languages: AppSettings['ocrLanguage'][] = [
  'English',
  'Hindi',
  'Japanese',
];

const SettingsScreen = () => {
  const {history, settings, updateSettings, clearHistory} = useMcq();
  const p = settings.theme === 'dark' ? dark : light;
  const clear = () =>
    Alert.alert(
      'Clear scan history?',
      `${history.length} saved scans will be deleted.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: clearHistory},
      ],
    );
  return (
    <ScrollView
      style={{backgroundColor: p.bg}}
      contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, styles.noTopMargin, {color: p.ink}]}>
        Appearance
      </Text>
      <View
        style={[
          styles.settingGroup,
          {backgroundColor: p.card, borderColor: p.border},
        ]}>
        <View style={styles.settingRow}>
          <View style={[styles.settingIcon, styles.purpleIcon]}>
            <Feather name="moon" size={18} color={p.primary} />
          </View>
          <View style={styles.settingCopy}>
            <Text style={[styles.settingTitle, {color: p.ink}]}>
              Dark theme
            </Text>
            <Text style={[styles.settingMeta, {color: p.text}]}>
              Reduce glare while studying
            </Text>
          </View>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={value =>
              updateSettings({...settings, theme: value ? 'dark' : 'light'})
            }
            trackColor={{true: p.primary}}
          />
        </View>
      </View>
      <Text style={[styles.sectionTitle, {color: p.ink}]}>OCR language</Text>
      <View
        style={[
          styles.settingGroup,
          {backgroundColor: p.card, borderColor: p.border},
        ]}>
        <View style={styles.settingRow}>
          <View style={[styles.settingIcon, styles.tealIcon]}>
            <Feather name="globe" size={18} color="#258D83" />
          </View>
          <View style={styles.settingCopy}>
            <Text style={[styles.settingTitle, {color: p.ink}]}>
              Recognition script
            </Text>
            <Text style={[styles.settingMeta, {color: p.text}]}>
              Choose the text used in your material
            </Text>
          </View>
        </View>
        <View style={styles.pills}>
          {languages.map(language => (
            <TouchableOpacity
              key={language}
              style={[
                styles.pill,
                {
                  borderColor:
                    settings.ocrLanguage === language ? p.primary : p.border,
                  backgroundColor:
                    settings.ocrLanguage === language ? p.primary : p.card,
                },
              ]}
              onPress={() =>
                updateSettings({...settings, ocrLanguage: language})
              }>
              <Text
                style={[
                  styles.pillText,
                  {color: settings.ocrLanguage === language ? '#FFF' : p.text},
                ]}>
                {language}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={[styles.sectionTitle, {color: p.ink}]}>Data</Text>
      <TouchableOpacity
        style={[styles.clearButton, {borderColor: p.danger}]}
        onPress={clear}>
        <Text style={[styles.clearText, {color: p.danger}]}>
          Clear history ({history.length})
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;
