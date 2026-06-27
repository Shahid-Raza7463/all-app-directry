import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import {ExpenseStackParamList} from '../../App';
import {useExpenses} from './ExpenseStore';
import {palette, styles} from './expenseStyles';
import {
  categoryColor,
  categoryIcon,
  currentMonth,
  money,
  monthlyTotals,
  shortDate,
} from './expenseUtils';

type Props = NativeStackScreenProps<ExpenseStackParamList, 'ExpenseDashboard'>;

const ExpenseDashboardScreen = ({navigation}: Props) => {
  const {transactions, loading} = useExpenses();
  const totals = monthlyTotals(transactions);
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={palette.navy} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.dashboardContent}>
        <View style={styles.dashboardHeader}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>FINANCIAL OVERVIEW</Text>
              <Text style={styles.heading}>Good day!</Text>
            </View>
            <View style={styles.profile}>
              <Feather name="pie-chart" size={20} color={palette.lime} />
            </View>
          </View>
        </View>
        <View style={styles.walletWrap}>
          <LinearGradient
            colors={['#D8FF9A', '#AEE95B']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.wallet}>
            <Text style={styles.walletLabel}>MONTHLY BALANCE</Text>
            <Text style={styles.balance}>
              {money(totals.income - totals.expense)}
            </Text>
            <Text style={styles.walletMonth}>{currentMonth()}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <Feather name="arrow-down-left" size={17} color="#26745A" />
                </View>
                <View style={styles.summaryCopy}>
                  <Text style={styles.summaryLabel}>INCOME</Text>
                  <Text style={styles.summaryAmount}>
                    {money(totals.income)}
                  </Text>
                </View>
              </View>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <Feather name="arrow-up-right" size={17} color="#9A552C" />
                </View>
                <View style={styles.summaryCopy}>
                  <Text style={styles.summaryLabel}>EXPENSES</Text>
                  <Text style={styles.summaryAmount}>
                    {money(totals.expense)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Quick add</Text>
          </View>
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() =>
                navigation.navigate('TransactionForm', {initialType: 'income'})
              }>
              <View style={[styles.quickIcon, styles.incomeBg]}>
                <Feather name="plus" size={18} color="#238663" />
              </View>
              <Text style={styles.quickText}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() =>
                navigation.navigate('TransactionForm', {initialType: 'expense'})
              }>
              <View style={[styles.quickIcon, styles.expenseBg]}>
                <Feather name="minus" size={18} color="#C66A31" />
              </View>
              <Text style={styles.quickText}>Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recent activity</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.sectionLink}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionCard}>
            {!recent.length ? (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Feather name="credit-card" size={26} color={palette.text} />
                </View>
                <Text style={styles.emptyTitle}>No transactions yet</Text>
                <Text style={styles.emptyText}>
                  Add income or an expense to see your monthly picture.
                </Text>
              </View>
            ) : (
              recent.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.transaction,
                    index < recent.length - 1 && styles.transactionBorder,
                  ]}>
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
                  </View>
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
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        accessibilityLabel="Add transaction"
        style={styles.fab}
        onPress={() => navigation.navigate('TransactionForm')}>
        <Feather name="plus" size={27} color={palette.lime} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ExpenseDashboardScreen;
