import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, Search, MoreVertical, Users, Plus } from 'lucide-react-native';
import { theme } from '../shared/theme';

interface HeaderProps {
  channelName: string;
  isPrivate?: boolean;
  memberCount?: number;
  onMenuPress: () => void;
  onSearchPress?: () => void;
  onMembersPress?: () => void;
  onSettingsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  channelName,
  isPrivate,
  memberCount,
  onMenuPress,
  onSearchPress,
  onMembersPress,
  onSettingsPress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress}>
          <Menu color={theme.colors.text.primary} size={20} />
        </TouchableOpacity>
        <View style={styles.channelInfo}>
          <Text style={styles.channelName}>
            {isPrivate ? '🔒 ' : '# '}
            {channelName}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onMembersPress}>
          <View style={styles.memberInfo}>
            <Users color={theme.colors.text.secondary} size={18} />
            <Text style={styles.memberCount}>{memberCount || 0}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={onSearchPress}>
          <Search color={theme.colors.text.secondary} size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onSettingsPress}>
          <MoreVertical color={theme.colors.text.secondary} size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: theme.layout.headerHeight,
    backgroundColor: theme.colors.bg.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBtn: {
    marginRight: theme.spacing[3],
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginLeft: theme.spacing[4],
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.xs,
    marginLeft: theme.spacing[1],
  },
});
