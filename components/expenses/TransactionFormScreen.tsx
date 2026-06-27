import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {ExpenseStackParamList} from '../../App';
import {categories, TransactionType, useExpenses} from './ExpenseStore';
import {palette, styles} from './expenseStyles';

type Props = NativeStackScreenProps<ExpenseStackParamList, 'TransactionForm'>;

const TransactionFormScreen = ({navigation, route}: Props) => {
  const {transactions, addTransaction, updateTransaction} = useExpenses();
  const existing = transactions.find(
    item => item.id === route.params?.transactionId,
  );
  const [type, setType] = useState<TransactionType>(
    existing?.type ?? route.params?.initialType ?? 'expense',
  );
  const [title, setTitle] = useState(existing?.title ?? '');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [submitted, setSubmitted] = useState(false);
  const invalidTitle = submitted && !title.trim();
  const invalidAmount = submitted && (!Number(amount) || Number(amount) <= 0);
  const invalidCategory = submitted && !category;

  const save = () => {
    setSubmitted(true);
    if (!title.trim() || !Number(amount) || Number(amount) <= 0 || !category) {
      return;
    }
    const input = {title, amount: Number(amount), type, category, note};
    if (existing) {
      updateTransaction(existing.id, input);
    } else {
      addTransaction(input);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled">
        <View style={styles.typeSwitch}>
          {(['expense', 'income'] as TransactionType[]).map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.typeButton,
                type === item &&
                  (item === 'income' ? styles.incomeOn : styles.expenseOn),
              ]}
              onPress={() => setType(item)}>
              <Feather
                name={item === 'income' ? 'arrow-down-left' : 'arrow-up-right'}
                size={17}
                color={type === item ? palette.ink : palette.muted}
              />
              <Text
                style={[styles.typeText, type === item && styles.typeTextOn]}>
                {item[0].toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>TITLE</Text>
        <TextInput
          autoFocus
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Grocery shopping"
          placeholderTextColor={palette.muted}
          style={[styles.input, invalidTitle && styles.inputError]}
        />
        {invalidTitle && <Text style={styles.error}>A title is required.</Text>}
        <Text style={styles.label}>AMOUNT</Text>
        <TextInput
          value={amount}
          onChangeText={value => setAmount(value.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
          placeholder="₹0"
          placeholderTextColor={palette.muted}
          style={[
            styles.input,
            styles.amountInput,
            invalidAmount && styles.inputError,
          ]}
        />
        {invalidAmount && (
          <Text style={styles.error}>Enter a valid amount.</Text>
        )}
        <Text style={styles.label}>CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {categories.map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryChoice,
                category === item && styles.categoryChoiceOn,
              ]}
              onPress={() => setCategory(item)}>
              <Text
                style={[
                  styles.chipText,
                  category === item && styles.chipTextOn,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {invalidCategory && (
          <Text style={styles.error}>Choose a category.</Text>
        )}
        <Text style={styles.label}>NOTE</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          multiline
          placeholder="Optional details"
          placeholderTextColor={palette.muted}
          style={[styles.input, styles.noteInput]}
        />
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Feather name="check" size={18} color={palette.lime} />
          <Text style={styles.saveText}>
            {existing ? 'Save changes' : `Add ${type}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TransactionFormScreen;
