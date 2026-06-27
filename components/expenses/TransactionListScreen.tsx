import React, {useMemo, useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {ExpenseStackParamList} from '../../App';
import {categories, Transaction, useExpenses} from './ExpenseStore';
import {palette, styles} from './expenseStyles';
import {categoryColor, categoryIcon, money, shortDate} from './expenseUtils';

type Props = NativeStackScreenProps<ExpenseStackParamList, 'Transactions'>;

const TransactionListScreen = ({navigation}: Props) => {
  const {transactions, deleteTransaction} = useExpenses();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...transactions]
      .filter(
        item =>
          (category === 'All' || item.category === category) &&
          (!term ||
            item.title.toLowerCase().includes(term) ||
            item.note.toLowerCase().includes(term)),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [category, query, transactions]);

  const remove = (item: Transaction) =>
    Alert.alert('Delete transaction?', `“${item.title}” will be removed.`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(item.id),
      },
    ]);

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.search}>
          <Feather name="search" size={18} color={palette.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search transactions"
            placeholderTextColor={palette.muted}
            style={styles.searchInput}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={18} color={palette.muted} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          {['All', ...categories].map(item => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, category === item && styles.chipOn]}
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
        </ScrollView>
        {!filtered.length ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="filter" size={26} color={palette.text} />
            </View>
            <Text style={styles.emptyTitle}>Nothing found</Text>
            <Text style={styles.emptyText}>
              Try another search or category filter.
            </Text>
          </View>
        ) : (
          filtered.map(item => (
            <View key={item.id} style={styles.listCard}>
              <View
                style={[
                  styles.categoryIcon,
                  {backgroundColor: categoryColor(item.category)},
                ]}>
                <Feather
                  name={categoryIcon(item.category)}
                  size={18}
                  color={palette.navy}
                />
              </View>
              <View style={styles.transactionCopy}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionMeta}>
                  {item.category} · {shortDate(item.date)}
                </Text>
                <Text
                  style={
                    item.type === 'income'
                      ? styles.amountIncome
                      : styles.amountExpense
                  }>
                  {item.type === 'income' ? '+' : '−'}
                  {money(item.amount)}
                </Text>
              </View>
              <View style={styles.listActions}>
                <TouchableOpacity
                  accessibilityLabel="Edit transaction"
                  onPress={() =>
                    navigation.navigate('TransactionForm', {
                      transactionId: item.id,
                    })
                  }>
                  <Feather name="edit-2" size={17} color={palette.navy} />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel="Delete transaction"
                  onPress={() => remove(item)}>
                  <Feather name="trash-2" size={17} color={palette.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        accessibilityLabel="Add transaction"
        style={styles.fab}
        onPress={() => navigation.navigate('TransactionForm')}>
        <Feather name="plus" size={27} color={palette.lime} />
      </TouchableOpacity>
    </View>
  );
};

export default TransactionListScreen;
