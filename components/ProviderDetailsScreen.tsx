import React from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useProviders} from './ProviderStore';

const fallbackPhoto = require('../assets/images/FB_IMG_1545560289018.jpg');

export default function ProviderDetailsScreen({navigation, route}: any) {
  const {providers, deleteProvider} = useProviders();
  const provider = providers.find(item => item.id === route.params.providerId);

  if (!provider) {
    return (
      <View style={s.missing}>
        <Icon name="person-off" size={42} color="#8A93A5" />
        <Text style={s.missingTitle}>Provider not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const remove = () =>
    Alert.alert(
      'Delete provider?',
      `${provider.name} will be removed from this device.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProvider(provider.id);
            navigation.goBack();
          },
        },
      ],
    );

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <View style={s.hero}>
        <Image
          source={provider.photo ? {uri: provider.photo} : fallbackPhoto}
          style={s.photo}
        />
        <Text style={s.name}>{provider.name}</Text>
        <Text style={s.category}>{provider.category}</Text>
        <View style={s.rating}>
          <Icon name="star" size={18} color="#F6A609" />
          <Text style={s.ratingText}>{provider.rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={s.card}>
        <Detail icon="location-on" label="Location" value={provider.location} />
        <Detail
          icon="work-outline"
          label="Experience"
          value={`${provider.experience} years`}
        />
        <Detail icon="phone" label="Phone" value={provider.phone} />
        <Text style={s.aboutLabel}>About</Text>
        <Text style={s.description}>
          {provider.description || 'No description added.'}
        </Text>
      </View>
      <TouchableOpacity
        style={s.call}
        onPress={() => Linking.openURL(`tel:${provider.phone}`)}>
        <Icon name="call" size={21} color="#FFF" />
        <Text style={s.callText}>Call provider</Text>
      </TouchableOpacity>
      <View style={s.actions}>
        <TouchableOpacity
          style={s.edit}
          onPress={() =>
            navigation.navigate('ProviderForm', {providerId: provider.id})
          }>
          <Icon name="edit" size={20} color="#3563E9" />
          <Text style={s.editText}>Edit provider</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.delete} onPress={remove}>
          <Icon name="delete-outline" size={21} color="#D9475C" />
          <Text style={s.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={s.detail}>
      <View style={s.detailIcon}>
        <Icon name={icon} size={20} color="#3563E9" />
      </View>
      <View>
        <Text style={s.detailLabel}>{label}</Text>
        <Text style={s.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F6F8FC'},
  content: {padding: 20, paddingBottom: 36},
  hero: {alignItems: 'center', paddingVertical: 12},
  photo: {
    width: 112,
    height: 112,
    borderRadius: 32,
    backgroundColor: '#E5EAF2',
  },
  name: {fontSize: 25, fontWeight: '800', color: '#20293A', marginTop: 16},
  category: {fontSize: 14, fontWeight: '600', color: '#3563E9', marginTop: 4},
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3D2',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 10,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7B5900',
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginTop: 13,
    shadowColor: '#172033',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  detail: {flexDirection: 'row', alignItems: 'center', marginBottom: 17},
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailLabel: {fontSize: 11, color: '#8A93A5'},
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B465A',
    marginTop: 2,
  },
  aboutLabel: {fontSize: 14, fontWeight: '800', color: '#273146', marginTop: 2},
  description: {fontSize: 14, lineHeight: 22, color: '#687387', marginTop: 7},
  call: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#3563E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  callText: {fontSize: 15, fontWeight: '800', color: '#FFF', marginLeft: 8},
  actions: {flexDirection: 'row', gap: 11, marginTop: 11},
  edit: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#E9EFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {color: '#3563E9', fontWeight: '700', marginLeft: 7},
  delete: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#FFE9ED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17,
  },
  deleteText: {color: '#D9475C', fontWeight: '700', marginLeft: 5},
  missing: {
    flex: 1,
    backgroundColor: '#F6F8FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B465A',
    marginTop: 12,
  },
  backText: {color: '#3563E9', fontWeight: '700', marginTop: 16},
});
