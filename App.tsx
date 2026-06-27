import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import ExpenseDashboardScreen from './components/expenses/ExpenseDashboardScreen';
import TransactionListScreen from './components/expenses/TransactionListScreen';
import TransactionFormScreen from './components/expenses/TransactionFormScreen';
import {ExpenseProvider} from './components/expenses/ExpenseStore';

export type ExpenseStackParamList = {
  ExpenseDashboard: undefined;
  Transactions: undefined;
  TransactionForm:
    | {transactionId?: string; initialType?: 'income' | 'expense'}
    | undefined;
};

const Stack = createNativeStackNavigator<ExpenseStackParamList>();
const theme = {
  ...DefaultTheme,
  colors: {...DefaultTheme.colors, background: '#F7F8FC'},
};

function App() {
  return (
    <ExpenseProvider>
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
            name="ExpenseDashboard"
            component={ExpenseDashboardScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Transactions"
            component={TransactionListScreen}
            options={{title: 'Transactions'}}
          />
          <Stack.Screen
            name="TransactionForm"
            component={TransactionFormScreen}
            options={({route}) => ({
              title: route.params?.transactionId
                ? 'Edit transaction'
                : 'New transaction',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpenseProvider>
  );
}

export default App;
