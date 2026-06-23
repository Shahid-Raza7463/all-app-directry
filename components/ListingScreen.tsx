import React, {useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Provider, useProviders} from './ProviderStore';

const fallbackPhoto = require('../assets/images/FB_IMG_1545560289018.jpg');

export default function ListingScreen({navigation, route}: any) {
  const {category} = route.params;
  const {providers, ready, deleteProvider} = useProviders();
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return providers
      .filter(item => item.category === category && item.rating >= minRating)
      .filter(
        item =>
          !needle ||
          `${item.name} ${item.location}`.toLowerCase().includes(needle),
      )
      .sort((a, b) => b.rating - a.rating);
  }, [category, minRating, providers, query]);
  const call = (phone: string) => Linking.openURL(`tel:${phone}`);
  const remove = (provider: Provider) =>
    Alert.alert(
      'Delete provider?',
      `${provider.name} will be removed from this device.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProvider(provider.id),
        },
      ],
    );

  return (
    <View style={s.screen}>
      <View style={s.tools}>
        <View style={s.search}>
          <Icon name="search" size={23} color="#8A93A5" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search name or location"
            placeholderTextColor="#9AA2B1"
            style={s.searchInput}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Icon name="cancel" size={20} color="#A6ADBA" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[s.filterButton, minRating > 0 && s.filterActive]}
          onPress={() => setFilterOpen(value => !value)}>
          <Icon name="tune" size={23} color={minRating ? '#FFF' : '#3B465A'} />
        </TouchableOpacity>
      </View>
      {filterOpen && (
        <View style={s.filterPanel}>
          <Text style={s.filterLabel}>Minimum rating</Text>
          {[0, 4, 4.5].map(rating => (
            <TouchableOpacity
              key={rating}
              style={[s.chip, minRating === rating && s.chipActive]}
              onPress={() => setMinRating(rating)}>
              <Text
                style={[s.chipText, minRating === rating && s.chipTextActive]}>
                {rating === 0 ? 'All' : `${rating}+`}
              </Text>
              {rating > 0 && (
                <Icon
                  name="star"
                  size={13}
                  color={minRating === rating ? '#2756D8' : '#657087'}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={s.resultHeader}>
        <Text style={s.resultCount}>
          {ready ? `${results.length} providers` : 'Loading...'}
        </Text>
        <Text style={s.sortText}>Top rated first</Text>
      </View>
      <ScrollView
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}>
        {ready && results.length === 0 ? (
          <EmptyState />
        ) : (
          results.map(item => (
            <View key={item.id} style={s.card}>
              <View style={s.cardTop}>
                <Image
                  source={item.photo ? {uri: item.photo} : fallbackPhoto}
                  style={s.avatar}
                />
                <View style={s.identity}>
                  <Text style={s.name}>{item.name}</Text>
                  <Text style={s.profession}>{item.category}</Text>
                  <View style={s.metaRow}>
                    <Icon name="location-on" size={16} color="#7C879A" />
                    <Text style={s.meta} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                </View>
                <View style={s.rating}>
                  <Icon name="star" size={16} color="#F6A609" />
                  <Text style={s.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
              </View>
              <View style={s.experience}>
                <Icon name="work-outline" size={17} color="#3563E9" />
                <Text style={s.experienceText}>
                  {item.experience} years experience
                </Text>
              </View>
              <View style={s.actions}>
                <TouchableOpacity
                  style={s.callButton}
                  onPress={() => call(item.phone)}>
                  <Icon name="call" size={19} color="#FFF" />
                  <Text style={s.callText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.profileButton}
                  onPress={() =>
                    navigation.navigate('ProviderDetails', {
                      providerId: item.id,
                    })
                  }>
                  <Text style={s.profileText}>View profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.iconAction}
                  onPress={() =>
                    navigation.navigate('ProviderForm', {providerId: item.id})
                  }>
                  <Icon name="edit" size={20} color="#536078" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.iconAction}
                  onPress={() => remove(item)}>
                  <Icon name="delete-outline" size={21} color="#E25366" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('ProviderForm', {category})}>
        <Icon name="add" size={26} color="#FFF" />
        <Text style={s.fabText}>Add provider</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <Icon name="person-search" size={36} color="#3563E9" />
      </View>
      <Text style={s.emptyTitle}>No providers found</Text>
      <Text style={s.emptyText}>
        Try another search or add the first provider here.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F6F8FC'},
  tools: {flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingTop: 8},
  search: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E9ECF2',
  },
  searchInput: {flex: 1, fontSize: 15, color: '#232B3B', marginLeft: 8},
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E9ECF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterActive: {backgroundColor: '#3563E9', borderColor: '#3563E9'},
  filterPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 8,
  },
  filterLabel: {fontSize: 13, fontWeight: '600', color: '#647086'},
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#E9EDF5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  chipActive: {backgroundColor: '#DCE5FF'},
  chipText: {fontSize: 12, color: '#657087', fontWeight: '600'},
  chipTextActive: {color: '#2756D8'},
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 19,
    marginTop: 20,
    marginBottom: 10,
  },
  resultCount: {fontSize: 16, fontWeight: '700', color: '#252D3D'},
  sortText: {fontSize: 12, color: '#8992A3'},
  list: {paddingHorizontal: 18, paddingBottom: 105},
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 13,
    shadowColor: '#172033',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {flexDirection: 'row', alignItems: 'flex-start'},
  avatar: {width: 62, height: 62, borderRadius: 18, backgroundColor: '#E8ECF4'},
  identity: {flex: 1, marginLeft: 13},
  name: {fontSize: 17, fontWeight: '800', color: '#252D3D'},
  profession: {fontSize: 13, fontWeight: '600', color: '#3563E9', marginTop: 3},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: -2,
  },
  meta: {fontSize: 12, color: '#7C879A', flex: 1},
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6DF',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  ratingText: {
    fontSize: 12,
    color: '#825C00',
    fontWeight: '700',
    marginLeft: 3,
  },
  experience: {
    flexDirection: 'row',
    backgroundColor: '#F1F5FF',
    borderRadius: 10,
    padding: 9,
    alignItems: 'center',
    marginTop: 14,
  },
  experienceText: {
    fontSize: 12,
    color: '#536078',
    marginLeft: 7,
    fontWeight: '600',
  },
  actions: {flexDirection: 'row', gap: 8, marginTop: 13},
  callButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3563E9',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  callText: {color: '#FFF', fontWeight: '700', fontSize: 13, marginLeft: 6},
  profileButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE2EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {fontSize: 13, fontWeight: '700', color: '#455168'},
  iconAction: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    height: 54,
    paddingHorizontal: 19,
    borderRadius: 18,
    backgroundColor: '#3563E9',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#3563E9',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  fabText: {color: '#FFF', fontWeight: '700', marginLeft: 7},
  empty: {alignItems: 'center', paddingTop: 70, paddingHorizontal: 30},
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#E8EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#293246',
    marginTop: 17,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#7A8598',
    textAlign: 'center',
    marginTop: 7,
  },
});
