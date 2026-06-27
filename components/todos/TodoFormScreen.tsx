import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {TodoStackParamList} from '../../App';
import {useTodos} from './TodoStore';
import {colors, styles} from './todoStyles';

type Props = NativeStackScreenProps<TodoStackParamList, 'TodoForm'>;

const TodoFormScreen = ({navigation, route}: Props) => {
  const {tasks, addTask, updateTask} = useTodos();
  const task = tasks.find(item => item.id === route.params?.taskId);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !title.trim();

  const save = () => {
    setSubmitted(true);
    if (!title.trim()) {return;}
    if (task) {updateTask(task.id, title, description);}
    else {addTask(title, description);}
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>TASK TITLE</Text>
        <TextInput
          autoFocus
          value={title}
          onChangeText={setTitle}
          maxLength={120}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.muted}
          style={[styles.input, invalid && styles.inputError]}
        />
        {invalid && <Text style={styles.error}>A task title is required.</Text>}
        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={1000}
          placeholder="Add details (optional)"
          placeholderTextColor={colors.muted}
          style={[styles.input, styles.textArea]}
        />
        <Text style={styles.hint}>
          You can mark the task complete from your list.
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Feather name="check" size={18} color="#FFF" />
          <Text style={styles.addButtonText}>
            {task ? 'Save changes' : 'Add task'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TodoFormScreen;
