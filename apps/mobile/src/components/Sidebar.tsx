import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Hash, Lock, ChevronDown, Plus, Settings } from 'lucide-react-native';
import { theme } from '../shared/theme';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85;

interface SidebarProps {
  workspaceName: string;
  channels: Array<{ id: string; name: string; isPrivate: boolean }>;
  activeChannelId: string;
  onChannelPress: (id: string) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  workspaceName,
  channels,
  activeChannelId,
  onChannelPress,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.workspaceHeader}>
        <Text style={styles.workspaceName}>{workspaceName}</Text>
        <ChevronDown color={theme.colors.text.secondary} size={16} />
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Channels</Text>
            <Plus color={theme.colors.text.tertiary} size={16} />
          </View>

          {channels.map((channel) => (
            <TouchableOpacity
              key={channel.id}
              style={[
                styles.item,
                activeChannelId === channel.id && styles.itemActive
              ]}
              onPress={() => {
                onChannelPress(channel.id);
                onClose();
              }}
            >
              <View style={styles.itemIcon}>
                {channel.isPrivate ? (
                  <Lock color={activeChannelId === channel.id ? theme.colors.text.primary : theme.colors.text.secondary} size={16} />
                ) : (
                  <Hash color={activeChannelId === channel.id ? theme.colors.text.primary : theme.colors.text.secondary} size={16} />
                )}
              </View>
              <Text style={[
                styles.itemText,
                activeChannelId === channel.id && styles.itemTextActive
              ]}>
                {channel.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Direct Messages</Text>
            <Plus color={theme.colors.text.tertiary} size={16} />
          </View>
          <Text style={styles.emptyText}>No direct messages yet</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Settings color={theme.colors.text.secondary} size={20} />
          <Text style={styles.footerText}>Preferences</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.secondary,
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.subtle,
  },
  workspaceHeader: {
    height: theme.layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  workspaceName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.lg,
    fontWeight: '700',
    marginRight: theme.spacing[2],
  },
  scroll: {
    flex: 1,
  },
  section: {
    marginTop: theme.spacing[6],
    paddingHorizontal: theme.spacing[2],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  sectionTitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    borderRadius: theme.radius.md,
    marginBottom: 2,
  },
  itemActive: {
    backgroundColor: theme.colors.bg.active,
  },
  itemIcon: {
    marginRight: theme.spacing[3],
    opacity: 0.7,
  },
  itemText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.md,
  },
  itemTextActive: {
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  emptyText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.size.sm,
    paddingHorizontal: theme.spacing[2],
    marginTop: theme.spacing[2],
    fontStyle: 'italic',
  },
  footer: {
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.base,
    marginLeft: theme.spacing[3],
  },
});
