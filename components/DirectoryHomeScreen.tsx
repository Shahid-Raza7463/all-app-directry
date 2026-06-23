import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CATEGORIES, useProviders} from './ProviderStore';

const meta: Record<string, {icon: string; color: string; tint: string}> = {
  Doctor: {icon: 'medical-services', color: '#3563E9', tint: '#E9EFFF'},
  '4 Wheeler Driver': {
    icon: 'directions-car',
    color: '#7C4DFF',
    tint: '#F0EAFF',
  },
  'Auto Driver': {icon: 'electric-rickshaw', color: '#F59E0B', tint: '#FFF4D9'},
  Helper: {icon: 'handyman', color: '#0F9D78', tint: '#DFF7EF'},
  'Medicine Shop': {icon: 'local-pharmacy', color: '#E84A5F', tint: '#FFE8EC'},
};

export default function DirectoryHomeScreen({navigation}: any) {
  const {providers} = useProviders();
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.header}>
          <View style={s.brand}>
            <Icon name="hub" size={25} color="#FFF" />
          </View>
          <Text style={s.eyebrow}>SERVE NEARBY</Text>
          <Text style={s.title}>{'Find trusted help,\nright around you.'}</Text>
          <Text style={s.subtitle}>
            Browse trusted local professionals and connect in a tap.
          </Text>
          <View style={s.stats}>
            <View>
              <Text style={s.statsValue}>{providers.length}</Text>
              <Text style={s.statsLabel}>Local providers</Text>
            </View>
            <View style={s.divider} />
            <View>
              <Text style={s.statsValue}>{CATEGORIES.length}</Text>
              <Text style={s.statsLabel}>Service categories</Text>
            </View>
          </View>
          <Text style={s.section}>What do you need?</Text>
        </View>
        <View style={s.grid}>
          {CATEGORIES.map(item => {
            const count = providers.filter(
              provider => provider.category === item,
            ).length;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                style={s.card}
                onPress={() =>
                  navigation.navigate('Listing', {category: item})
                }>
                <View style={[s.iconBox, {backgroundColor: meta[item].tint}]}>
                  <Icon
                    name={meta[item].icon}
                    size={29}
                    color={meta[item].color}
                  />
                </View>
                <Text style={s.cardTitle}>{item}</Text>
                <View style={s.cardFooter}>
                  <Text style={s.count}>{count} available</Text>
                  <Icon name="arrow-forward" size={18} color="#8992A3" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F6F8FC'},
  content: {padding: 20, paddingBottom: 36},
  header: {marginBottom: 2},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 14},
  brand: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#3563E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3563E9',
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    color: '#172033',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6D7688',
    marginTop: 10,
    maxWidth: 340,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#172033',
    borderRadius: 20,
    padding: 20,
    marginVertical: 25,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statsValue: {fontSize: 23, fontWeight: '800', color: '#FFF'},
  statsLabel: {fontSize: 12, color: '#B9C1CF', marginTop: 3},
  divider: {width: 1, height: 38, backgroundColor: '#3A4252'},
  section: {
    fontSize: 20,
    fontWeight: '800',
    color: '#172033',
    marginBottom: 15,
  },
  card: {
    width: '47.8%',
    minHeight: 156,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#172033',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    color: '#252D3D',
    marginTop: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  count: {fontSize: 12, color: '#8992A3'},
});
