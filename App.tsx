import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import HomeScreen from './components/DirectoryHomeScreen';
import ListingScreen from './components/ListingScreen';
import ProviderFormScreen from './components/ProviderFormScreen';
import ProviderDetailsScreen from './components/ProviderDetailsScreen';
import {ProviderStore} from './components/ProviderStore';

export type RootStackParamList = {
  Home: undefined;
  Listing: {category: string};
  ProviderForm: {category?: string; providerId?: string};
  ProviderDetails: {providerId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const theme = {
  ...DefaultTheme,
  colors: {...DefaultTheme.colors, background: '#F6F8FC'},
};

function App() {
  return (
    <ProviderStore>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="#F6F8FC" />
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: {backgroundColor: '#F6F8FC'},
            headerTintColor: '#172033',
            headerTitleStyle: {fontWeight: '700'},
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Listing"
            component={ListingScreen}
            options={({route}) => ({title: route.params.category})}
          />
          <Stack.Screen
            name="ProviderForm"
            component={ProviderFormScreen}
            options={({route}) => ({
              title: route.params?.providerId ? 'Edit provider' : 'Add provider',
            })}
          />
          <Stack.Screen
            name="ProviderDetails"
            component={ProviderDetailsScreen}
            options={{title: 'Provider details'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProviderStore>
  );
}

export default App;
