import React, {memo, useMemo, useCallback} from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import {colors} from '../styles/colors';
import {User} from '../types/user';

interface Props {
  user: User;
  onPress: (user: User) => void;
}

const UserItemComponent = ({user, onPress}: Props) => {
  const initials = useMemo(() => {
    if (!user?.name) {
      return '';
    }
    const parts = user.name.trim().split(' ');
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase();
  }, [user.name]);

  const handlePress = useCallback(() => {
    onPress(user);
  }, [onPress, user]);

  return (
    <TouchableOpacity
      testID={`user-item-${user.id}`}
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

export default memo(
  UserItemComponent,
  (prev, next) =>
    prev.user.id === next.user.id &&
    prev.user.name === next.user.name &&
    prev.user.email === next.user.email,
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  info: {flex: 1},
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  email: {
    fontSize: 13,
    color: colors.secondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: colors.border,
    marginLeft: 8,
  },
});
