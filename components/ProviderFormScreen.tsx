import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CATEGORIES, Provider, useProviders} from './ProviderStore';

const fallbackPhoto = require('../assets/images/FB_IMG_1545560289018.jpg');
type FormValue = Omit<Provider, 'id'>;

export default function ProviderFormScreen({navigation, route}: any) {
  const {providers, addProvider, updateProvider} = useProviders();
  const existing = providers.find(item => item.id === route.params?.providerId);
  const [form, setForm] = useState<FormValue>({
    name: existing?.name || '',
    category: existing?.category || route.params?.category || CATEGORIES[0],
    phone: existing?.phone || '',
    location: existing?.location || '',
    experience: existing?.experience || 0,
    rating: existing?.rating || 5,
    photo: existing?.photo || '',
    description: existing?.description || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (key: keyof FormValue, value: string | number) =>
    setForm(current => ({...current, [key]: value}));
  const save = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) {
      next.name = 'Name is required';
    }
    if (!/^[+\d][\d\s-]{7,14}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid phone number';
    }
    if (!form.location.trim()) {
      next.location = 'Location is required';
    }
    if (form.rating < 0 || form.rating > 5) {
      next.rating = 'Rating must be from 0 to 5';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      return;
    }
    const clean = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      photo: form.photo.trim(),
      description: form.description.trim(),
    };
    if (existing) {
      updateProvider(existing.id, clean);
    } else {
      addProvider(clean);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled">
        <View style={s.photoSection}>
          <Image
            source={form.photo ? {uri: form.photo} : fallbackPhoto}
            style={s.photo}
          />
          <View style={s.photoCopy}>
            <Text style={s.photoTitle}>Provider photo</Text>
            <Text style={s.photoHint}>
              Paste an image URI below, or use the default avatar.
            </Text>
          </View>
        </View>
        <Field label="Full name" icon="person-outline" error={errors.name}>
          <TextInput
            value={form.name}
            onChangeText={value => set('name', value)}
            placeholder="e.g. Aisha Khan"
            style={s.input}
            placeholderTextColor="#A0A8B7"
          />
        </Field>
        <Text style={s.label}>Profession / category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.categories}>
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => set('category', category)}
              style={[
                s.category,
                form.category === category && s.categoryActive,
              ]}>
              <Text
                style={[
                  s.categoryText,
                  form.category === category && s.categoryTextActive,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Field label="Phone number" icon="phone" error={errors.phone}>
          <TextInput
            value={form.phone}
            onChangeText={value => set('phone', value)}
            placeholder="98765 43210"
            keyboardType="phone-pad"
            style={s.input}
            placeholderTextColor="#A0A8B7"
          />
        </Field>
        <Field label="Location" icon="location-on" error={errors.location}>
          <TextInput
            value={form.location}
            onChangeText={value => set('location', value)}
            placeholder="Area, city"
            style={s.input}
            placeholderTextColor="#A0A8B7"
          />
        </Field>
        <View style={s.split}>
          <View style={s.half}>
            <Field label="Experience" icon="work-outline">
              <TextInput
                value={String(form.experience || '')}
                onChangeText={value => set('experience', Number(value) || 0)}
                placeholder="Years"
                keyboardType="numeric"
                style={s.input}
                placeholderTextColor="#A0A8B7"
              />
            </Field>
          </View>
          <View style={s.half}>
            <Field label="Rating" icon="star-outline" error={errors.rating}>
              <TextInput
                value={String(form.rating)}
                onChangeText={value => set('rating', Number(value) || 0)}
                placeholder="0 - 5"
                keyboardType="decimal-pad"
                style={s.input}
                placeholderTextColor="#A0A8B7"
              />
            </Field>
          </View>
        </View>
        <Field label="Photo URI (optional)" icon="image">
          <TextInput
            value={form.photo}
            onChangeText={value => set('photo', value)}
            placeholder="https://... or file://..."
            autoCapitalize="none"
            style={s.input}
            placeholderTextColor="#A0A8B7"
          />
        </Field>
        <Field label="Description" icon="notes">
          <TextInput
            value={form.description}
            onChangeText={value => set('description', value)}
            placeholder="Services, availability and useful details"
            multiline
            textAlignVertical="top"
            style={[s.input, s.textarea]}
            placeholderTextColor="#A0A8B7"
          />
        </Field>
        <TouchableOpacity style={s.save} onPress={save} activeOpacity={0.85}>
          <Icon name={existing ? 'check' : 'add'} size={22} color="#FFF" />
          <Text style={s.saveText}>
            {existing ? 'Save changes' : 'Add provider'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.cancel} onPress={() => navigation.goBack()}>
          <Text style={s.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, !!error && s.inputError]}>
        <Icon name={icon} size={20} color={error ? '#E25366' : '#7A8598'} />
        {children}
      </View>
      {!!error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F6F8FC'},
  content: {padding: 20, paddingBottom: 38},
  photoSection: {
    backgroundColor: '#E9EFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  photo: {width: 70, height: 70, borderRadius: 20, backgroundColor: '#DDE3EF'},
  photoCopy: {flex: 1, marginLeft: 14},
  photoTitle: {fontSize: 16, fontWeight: '800', color: '#26314A'},
  photoHint: {fontSize: 12, lineHeight: 18, color: '#68748B', marginTop: 4},
  field: {marginBottom: 17},
  label: {fontSize: 13, fontWeight: '700', color: '#465269', marginBottom: 8},
  inputWrap: {
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E1E5EC',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputError: {borderColor: '#E25366'},
  input: {
    flex: 1,
    fontSize: 15,
    color: '#252D3D',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  error: {fontSize: 11, color: '#D93F55', marginTop: 5, marginLeft: 3},
  categories: {gap: 8, paddingBottom: 18},
  category: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#E9EDF4',
  },
  categoryActive: {backgroundColor: '#3563E9'},
  categoryText: {fontSize: 13, fontWeight: '600', color: '#657087'},
  categoryTextActive: {color: '#FFF'},
  split: {flexDirection: 'row', gap: 12},
  half: {flex: 1},
  textarea: {height: 105, paddingTop: 14},
  save: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#3563E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#3563E9',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
  saveText: {color: '#FFF', fontWeight: '800', fontSize: 15, marginLeft: 7},
  cancel: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelText: {color: '#667187', fontSize: 14, fontWeight: '700'},
});
