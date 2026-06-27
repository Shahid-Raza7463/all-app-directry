import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import TodoListScreen from './components/todos/TodoListScreen';
import TodoFormScreen from './components/todos/TodoFormScreen';
import {TodoProvider} from './components/todos/TodoStore';

export type TodoStackParamList = {
  TodoList: undefined;
  TodoForm: {taskId?: string} | undefined;
};

const Stack = createNativeStackNavigator<TodoStackParamList>();
const theme = {
  ...DefaultTheme,
  colors: {...DefaultTheme.colors, background: '#F7F8FC'},
};

function App() {
  return (
    <TodoProvider>
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
            name="TodoList"
            component={TodoListScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TodoForm"
            component={TodoFormScreen}
            options={({route}) => ({
              title: route.params?.taskId ? 'Edit task' : 'New task',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}

export default App;
