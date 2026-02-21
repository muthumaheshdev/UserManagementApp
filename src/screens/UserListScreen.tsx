import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {fetchUsers, loadMoreUsers, clearError} from '../store/reducers/users';
import {useAppDispatch} from '../store/hooks';
import UserItem from '../components/UserItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {User} from '../types/user';
import {RootState} from '../store';
import {colors} from '../styles/colors';
import ErrorView from '../components/ErrorView';
import SearchBar from '../components/SearchBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserList'>;

const UserListScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');

  const {visibleUsers, loading, loadingMore, hasMore, error, allUsers} =
    useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, allUsers.length]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) {
      return visibleUsers;
    }
    const lower = search.toLowerCase();
    return allUsers.filter(u => u.name.toLowerCase().includes(lower));
  }, [search, visibleUsers, allUsers]);

  const handleUserPress = useCallback(
    (user: User) => {
      navigation.navigate('UserDetail', {user});
    },
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<User>>(
    ({item}) => <UserItem user={item} onPress={handleUserPress} />,
    [handleUserPress],
  );

  const keyExtractor = useCallback((item: User) => item.id.toString(), []);

  const handleLoadMore = useCallback(() => {
    if (search.trim()) {
      return;
    }
    if (!loadingMore && hasMore) {
      dispatch(loadMoreUsers());
    }
  }, [dispatch, loadingMore, hasMore, search]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchUsers());
  }, [dispatch]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) {
      return null;
    }
    return (
      <ActivityIndicator style={styles.footerSpinner} color={colors.primary} />
    );
  }, [loadingMore]);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyText}>No users found</Text>
      </View>
    );
  }, [loading]);

  if (error && allUsers.length === 0) {
    return <ErrorView message={error} onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChange={setSearch} />
      {error && allUsers.length > 0 && (
        <View style={styles.inlineBanner}>
          <Text style={styles.bannerText}>
            ⚠️ Refresh failed. Showing cached data.
          </Text>
        </View>
      )}
      <FlatList
        testID="user-list"
        style={styles.list}
        data={filteredUsers as User[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onRefresh={handleRefresh}
        refreshing={loading}
        initialNumToRender={4}
        maxToRenderPerBatch={10}
        windowSize={10}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReachedThreshold={0.3}
        removeClippedSubviews
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  list: {flex: 1},
  listContent: {paddingTop: 8, paddingBottom: 24, flexGrow: 1},
  footerSpinner: {padding: 16},
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {fontSize: 40, marginBottom: 12},
  emptyText: {
    fontSize: 16,
    color: colors.secondary,
  },
  inlineBanner: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerText: {
    fontSize: 13,
    color: '#856404',
  },
});
