import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {TodoStackParamList} from '../../App';
import {Task, useTodos} from './TodoStore';
import {colors, styles} from './todoStyles';

type Props = NativeStackScreenProps<TodoStackParamList, 'TodoList'>;
type Filter = 'all' | 'pending' | 'completed';
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });

const TodoListScreen = ({navigation}: Props) => {
  const {tasks, loading, toggleTask, deleteTask} = useTodos();
  const [filter, setFilter] = useState<Filter>('all');
  const completed = tasks.filter(task => task.completed).length;
  const progressStyle: ViewStyle = {
    width: tasks.length ? `${(completed / tasks.length) * 100}%` : '0%',
  };
  const visible = useMemo(
    () =>
      tasks
        .filter(
          task =>
            filter === 'all' ||
            (filter === 'completed' ? task.completed : !task.completed),
        )
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [filter, tasks],
  );

  const remove = (task: Task) =>
    Alert.alert('Delete task?', `“${task.title}” will be removed.`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTask(task.id),
      },
    ]);

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
        <Text style={styles.eyebrow}>STAY ON TRACK</Text>
        <Text style={styles.heading}>My Tasks</Text>
        <Text style={styles.subtitle}>Small steps, nicely organized.</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.statIcon}>
          <Feather name="check-square" size={21} color={colors.primary} />
        </View>
        <View style={styles.statCopy}>
          <Text style={styles.statTitle}>
            {completed} of {tasks.length} completed
          </Text>
          <Text style={styles.statText}>
            {tasks.length - completed} tasks still waiting
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>
      <View style={styles.tabs}>
        {(['all', 'pending', 'completed'] as Filter[]).map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, filter === item && styles.tabActive]}
            onPress={() => setFilter(item)}>
            <Text
              style={[styles.tabText, filter === item && styles.tabTextActive]}>
              {item[0].toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {!visible.length ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather
                name={filter === 'completed' ? 'award' : 'clipboard'}
                size={37}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {filter === 'all' ? 'Nothing on your list' : `No ${filter} tasks`}
            </Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Add your first task and make today count.'
                : 'Tasks matching this status will appear here.'}
            </Text>
            {filter === 'all' && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('TodoForm')}>
                <Feather name="plus" size={18} color="#FFF" />
                <Text style={styles.addButtonText}>Add a task</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          visible.map(task => (
            <View key={task.id} style={styles.card}>
              <TouchableOpacity
                accessibilityLabel={
                  task.completed ? 'Mark pending' : 'Mark completed'
                }
                style={[styles.checkbox, task.completed && styles.checkboxOn]}
                onPress={() => toggleTask(task.id)}>
                {task.completed && (
                  <Feather name="check" size={14} color="#FFF" />
                )}
              </TouchableOpacity>
              <View style={styles.taskCopy}>
                <Text
                  style={[styles.taskTitle, task.completed && styles.taskDone]}>
                  {task.title}
                </Text>
                {!!task.description && (
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.taskDescription,
                      task.completed && styles.taskDone,
                    ]}>
                    {task.description}
                  </Text>
                )}
                <Text style={styles.taskMeta}>
                  {task.completed ? 'Completed' : 'Pending'} ·{' '}
                  {formatDate(task.createdAt)}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  accessibilityLabel="Edit task"
                  onPress={() =>
                    navigation.navigate('TodoForm', {taskId: task.id})
                  }>
                  <Feather name="edit-2" size={17} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel="Delete task"
                  onPress={() => remove(task)}>
                  <Feather name="trash-2" size={17} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        accessibilityLabel="Add task"
        style={styles.fab}
        onPress={() => navigation.navigate('TodoForm')}>
        <Feather name="plus" size={27} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TodoListScreen;
