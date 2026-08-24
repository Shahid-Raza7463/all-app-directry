import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

declare const jest: unknown;

const API_URL = 'https://shahid1.infinityfreeapp.com/api/friends';
const IS_TEST_RUNTIME = typeof jest !== 'undefined';
const REQUEST_TIMEOUT_MS = IS_TEST_RUNTIME ? 50 : 15000;

export type McqStackParamList = {
  McqHome: undefined;
  Scan: undefined;
  Results: {scanId: string};
  History: undefined;
  Settings: undefined;
};

export type ExpenseStackParamList = {
  ExpenseDashboard: undefined;
  Transactions: undefined;
  TransactionForm:
    | {transactionId?: string; initialType?: 'expense' | 'income'}
    | undefined;
};

export type NotesStackParamList = {
  NotesHome: undefined;
  NoteForm: {noteId?: string} | undefined;
  NoteDetail: {noteId: string};
};

export type TodoStackParamList = {
  TodoList: undefined;
  TodoForm: {taskId?: string} | undefined;
};

type Friend = {
  id?: string | number;
  name?: string;
  friend_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  city?: string;
  location?: string;
  address?: string;
  image?: string;
  photo?: string;
  avatar?: string;
  profile_image?: string;
  [key: string]: unknown;
};

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

const getTextValue = (friend: Friend, fields: string[], fallback = '') => {
  for (const field of fields) {
    const value = friend[field];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number') {
      return String(value);
    }
  }
  return fallback;
};

const getFriendsFromResponse = (response: unknown): Friend[] => {
  if (Array.isArray(response)) {
    return response.filter(item => item && typeof item === 'object') as Friend[];
  }

  if (response && typeof response === 'object') {
    const data = response as Record<string, unknown>;
    const possibleLists = [data.data, data.friends, data.result, data.results];
    const list = possibleLists.find(Array.isArray);

    if (Array.isArray(list)) {
      return list.filter(item => item && typeof item === 'object') as Friend[];
    }
  }

  return [];
};

const FriendCard = ({friend, index}: {friend: Friend; index: number}) => {
  const name = getTextValue(
    friend,
    ['name', 'friend_name', 'full_name', 'username'],
    `Friend ${index + 1}`,
  );
  const email = getTextValue(friend, ['email']);
  const phone = getTextValue(friend, ['phone', 'mobile', 'contact']);
  const place = getTextValue(friend, ['city', 'location', 'address']);
  const image = getTextValue(friend, [
    'image',
    'photo',
    'avatar',
    'profile_image',
  ]);
  const initial = name.charAt(0).toUpperCase();
  const accent = ['#24B8A8', '#F05D5E', '#745CF6', '#F4A261'][index % 4];

  return (
    <View style={styles.card}>
      <View style={[styles.accentRail, {backgroundColor: accent}]} />
      <View style={styles.avatarWrap}>
        {image ? (
          <Image source={{uri: image}} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarFallback, {backgroundColor: accent}]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        )}
      </View>

      <View style={styles.friendInfo}>
        <Text style={styles.friendName} numberOfLines={1}>
          {name}
        </Text>
        {email ? (
          <Text style={styles.friendDetail} numberOfLines={1}>
            {email}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          {phone ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaText} numberOfLines={1}>
                {phone}
              </Text>
            </View>
          ) : null}
          {place ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaText} numberOfLines={1}>
                {place}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const EmptyState = ({title, message, actionLabel, onAction}: EmptyStateProps) => (
  <View style={styles.stateWrap}>
    <View style={styles.stateMark}>
      <Text style={styles.stateMarkText}>FD</Text>
    </View>
    <Text style={styles.stateTitle}>{title}</Text>
    <Text style={styles.stateMessage}>{message}</Text>
    {actionLabel && onAction ? (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.retryButton}
        onPress={onAction}>
        <Text style={styles.retryText}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

function App() {
  const {width} = useWindowDimensions();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const listPadding = useMemo(
    () => ({
      paddingHorizontal: width >= 720 ? 32 : 18,
      paddingBottom: 28,
    }),
    [width],
  );

  const fetchFriends = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const controller =
        typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeout = controller
        ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
        : null;
      const response = await fetch(
        API_URL,
        controller ? {signal: controller.signal} : undefined,
      );
      if (timeout) {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        throw new Error('Unable to load friends right now.');
      }

      const json = await response.json();
      setFriends(getFriendsFromResponse(json));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load friends right now.',
      );
      setFriends([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F1EA" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>FriendData</Text>
          <Text style={styles.title}>People from your live API</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countNumber}>{friends.length}</Text>
          <Text style={styles.countLabel}>friends</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#24B8A8" />
          <Text style={styles.loadingText}>Fetching friends...</Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item, index) =>
            String(item.id ?? item.email ?? item.phone ?? index)
          }
          renderItem={({item, index}) => (
            <FriendCard friend={item} index={index} />
          )}
          contentContainerStyle={[
            listPadding,
            friends.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchFriends(true)}
              tintColor="#24B8A8"
              colors={['#24B8A8']}
            />
          }
          ListEmptyComponent={
            error ? (
              <EmptyState
                title="API connection failed"
                message={error}
                actionLabel="Try again"
                onAction={() => fetchFriends()}
              />
            ) : (
              <EmptyState
                title="No friends found"
                message="The API returned an empty friends list."
              />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F1EA',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  eyebrow: {
    color: '#24B8A8',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1E2528',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    maxWidth: 260,
    marginTop: 4,
  },
  countBadge: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#1E2528',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  countLabel: {
    color: '#BFECE6',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  card: {
    minHeight: 104,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECE3D7',
    shadowColor: '#64594D',
    shadowOpacity: 0.11,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 8},
    elevation: 3,
  },
  accentRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 7,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F5F1EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 14,
  },
  avatarImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  avatarFallback: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  friendInfo: {
    flex: 1,
    minWidth: 0,
  },
  friendName: {
    color: '#1E2528',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
  },
  friendDetail: {
    color: '#667174',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  metaPill: {
    maxWidth: '100%',
    backgroundColor: '#F3F8F7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaText: {
    color: '#2F6660',
    fontSize: 12,
    fontWeight: '800',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: '#667174',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  stateWrap: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  stateMark: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: '#1E2528',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    transform: [{rotate: '-8deg'}],
  },
  stateMarkText: {
    color: '#BFECE6',
    fontSize: 22,
    fontWeight: '900',
  },
  stateTitle: {
    color: '#1E2528',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  stateMessage: {
    color: '#667174',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#24B8A8',
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 18,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default App;
