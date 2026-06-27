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
import {NotesStackParamList} from '../../App';
import {useNotes} from './NotesStore';
import {colors, notesStyles as styles} from './notesStyles';

type Props = NativeStackScreenProps<NotesStackParamList, 'NoteForm'>;

const NoteFormScreen = ({navigation, route}: Props) => {
  const {notes, addNote, updateNote} = useNotes();
  const existing = notes.find(note => note.id === route.params?.noteId);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [submitted, setSubmitted] = useState(false);
  const titleError = submitted && !title.trim();
  const descriptionError = submitted && !description.trim();

  const save = () => {
    setSubmitted(true);
    if (!title.trim() || !description.trim()) {
      return;
    }
    if (existing) {
      updateNote(existing.id, title, description);
      navigation.replace('NoteDetail', {noteId: existing.id});
    } else {
      const id = addNote(title, description);
      navigation.replace('NoteDetail', {noteId: id});
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>TITLE</Text>
        <TextInput
          autoFocus
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          placeholder="Give your note a title"
          placeholderTextColor={colors.muted}
          style={[styles.input, titleError && styles.inputError]}
        />
        {titleError && <Text style={styles.error}>A title is required.</Text>}
        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={5000}
          placeholder="Write down your thoughts…"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            styles.textArea,
            descriptionError && styles.inputError,
          ]}
        />
        {descriptionError && (
          <Text style={styles.error}>A description is required.</Text>
        )}
        <TouchableOpacity style={styles.primaryButton} onPress={save}>
          <Feather name="check" size={18} color="#FFF" />
          <Text style={styles.primaryText}>
            {existing ? 'Save changes' : 'Save note'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NoteFormScreen;
