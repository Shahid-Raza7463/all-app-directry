import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import NotesHomeScreen from './components/notes/NotesHomeScreen';
import NoteFormScreen from './components/notes/NoteFormScreen';
import NoteDetailScreen from './components/notes/NoteDetailScreen';
import {NotesProvider} from './components/notes/NotesStore';

export type NotesStackParamList = {
  NotesHome: undefined;
  NoteForm: {noteId?: string} | undefined;
  NoteDetail: {noteId: string};
};

const Stack = createNativeStackNavigator<NotesStackParamList>();
const theme = {
  ...DefaultTheme,
  colors: {...DefaultTheme.colors, background: '#F7F8FC'},
};

function App() {
  return (
    <NotesProvider>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: {backgroundColor: '#F7F8FC'},
            headerTintColor: '#202636',
            headerTitleStyle: {fontWeight: '800'},
            contentStyle: {backgroundColor: '#F7F8FC'},
          }}>
          <Stack.Screen
            name="NotesHome"
            component={NotesHomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="NoteForm"
            component={NoteFormScreen}
            options={({route}) => ({
              title: route.params?.noteId ? 'Edit note' : 'New note',
            })}
          />
          <Stack.Screen
            name="NoteDetail"
            component={NoteDetailScreen}
            options={{title: 'Note'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NotesProvider>
  );
}

export default App;
