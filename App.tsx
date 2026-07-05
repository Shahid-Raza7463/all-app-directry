import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import McqHomeScreen from './components/mcq/McqHomeScreen';
import ScanScreen from './components/mcq/ScanScreen';
import ResultsScreen from './components/mcq/ResultsScreen';
import HistoryScreen from './components/mcq/HistoryScreen';
import SettingsScreen from './components/mcq/SettingsScreen';
import {McqProvider, useMcq} from './components/mcq/McqStore';

export type McqStackParamList = {
  McqHome: undefined;
  Scan: undefined;
  Results: {scanId: string};
  History: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<McqStackParamList>();

const AppContent = () => {
  const {settings} = useMcq();
  const dark = settings.theme === 'dark';
  const theme = {
    ...DefaultTheme,
    dark,
    colors: {
      ...DefaultTheme.colors,
      background: dark ? '#11141D' : '#F6F7FB',
      card: dark ? '#171B26' : '#FFFFFF',
      text: dark ? '#F4F5FA' : '#202432',
      border: dark ? '#272D3B' : '#E8EAF1',
    },
  };
  return (
    <NavigationContainer theme={theme}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={dark ? '#11141D' : '#F6F7FB'}
      />
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {backgroundColor: theme.colors.background},
          headerTintColor: theme.colors.text,
          headerTitleStyle: {fontWeight: '800'},
          contentStyle: {backgroundColor: theme.colors.background},
        }}>
        <Stack.Screen
          name="McqHome"
          component={McqHomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{title: 'Scan questions'}}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{title: 'Analysis results'}}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{title: 'Scan history'}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Settings'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App() {
  return (
    <McqProvider>
      <AppContent />
    </McqProvider>
  );
}

export default App;
