import React from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {NotesStackParamList} from '../../App';
import {useNotes} from './NotesStore';
import {colors, notesStyles as styles} from './notesStyles';

type Props = NativeStackScreenProps<NotesStackParamList, 'NoteDetail'>;
const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const NoteDetailScreen = ({navigation, route}: Props) => {
  const {notes, deleteNote} = useNotes();
  const note = notes.find(item => item.id === route.params.noteId);

  if (!note) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Note not found</Text>
        <TouchableOpacity
          style={[styles.primaryButton, styles.compactButton]}
          onPress={() => navigation.popToTop()}>
          <Text style={styles.primaryText}>Back to notes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const remove = () =>
    Alert.alert('Delete note?', 'This action cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteNote(note.id);
          navigation.popToTop();
        },
      },
    ]);

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.form}>
      <View style={styles.detailCard}>
        <View style={styles.noteIcon}>
          <Feather name="file-text" size={19} color={colors.primary} />
        </View>
        <Text style={styles.detailTitle}>{note.title}</Text>
        <Text style={styles.detailDate}>
          Created {formatDate(note.createdAt)}
        </Text>
        <Text style={styles.detailDescription}>{note.description}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate('NoteForm', {noteId: note.id})}>
          <Feather name="edit-2" size={16} color={colors.primary} />
          <Text style={styles.actionText}>Edit note</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.action, styles.deleteAction]}
          onPress={remove}>
          <Feather name="trash-2" size={16} color={colors.danger} />
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default NoteDetailScreen;
