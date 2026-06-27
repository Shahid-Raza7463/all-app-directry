import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {NotesStackParamList} from '../../App';
import {useNotes} from './NotesStore';
import {colors, notesStyles as styles} from './notesStyles';

type Props = NativeStackScreenProps<NotesStackParamList, 'NotesHome'>;
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const NotesHomeScreen = ({navigation}: Props) => {
  const {notes, loading} = useNotes();
  const [query, setQuery] = useState('');
  const filteredNotes = useMemo(() => {
    const term = query.trim().toLowerCase();
    return notes
      .filter(
        note =>
          !term ||
          note.title.toLowerCase().includes(term) ||
          note.description.toLowerCase().includes(term),
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, query]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MY WORKSPACE</Text>
        <Text style={styles.title}>Notes</Text>
        <Text style={styles.subtitle}>
          Capture ideas before they wander off.
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.search}>
          <Feather name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
        {!!notes.length && (
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>
              {query ? 'Search results' : 'Recent notes'}
            </Text>
            <Text style={styles.sectionMeta}>
              {filteredNotes.length}{' '}
              {filteredNotes.length === 1 ? 'note' : 'notes'}
            </Text>
          </View>
        )}
        {!filteredNotes.length ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather
                name={query ? 'search' : 'edit-3'}
                size={38}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {query ? 'No matching notes' : 'Your ideas start here'}
            </Text>
            <Text style={styles.emptyText}>
              {query
                ? 'Try a different title or keyword.'
                : 'Create your first note and keep every thought close at hand.'}
            </Text>
            {!query && (
              <TouchableOpacity
                style={[styles.primaryButton, styles.compactButton]}
                onPress={() => navigation.navigate('NoteForm')}>
                <Feather name="plus" size={18} color="#FFF" />
                <Text style={styles.primaryText}>Create a note</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredNotes.map(note => (
            <TouchableOpacity
              key={note.id}
              activeOpacity={0.8}
              style={styles.card}
              onPress={() =>
                navigation.navigate('NoteDetail', {noteId: note.id})
              }>
              <View style={styles.cardTop}>
                <View style={styles.noteIcon}>
                  <Feather name="file-text" size={19} color={colors.primary} />
                </View>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {note.title}
                  </Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {note.description}
                  </Text>
                  <View style={styles.dateRow}>
                    <Feather name="calendar" size={11} color={colors.muted} />
                    <Text style={styles.date}>
                      {formatDate(note.createdAt)}
                    </Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={19} color={colors.muted} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        accessibilityLabel="Add note"
        style={styles.fab}
        onPress={() => navigation.navigate('NoteForm')}>
        <Feather name="plus" size={27} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NotesHomeScreen;
