import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  StatusBar, 
  Animated, 
  Dimensions, 
  TouchableWithoutFeedback,
  ScrollView,
  Text
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/shared/theme';
import { Header } from './src/components/Header';
import { Sidebar } from './src/components/Sidebar';
import { MessageInput } from './src/components/MessageInput';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85;

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarAnim] = useState(new Animated.Value(-SIDEBAR_WIDTH));
  const [activeChannelId, setActiveChannelId] = useState('1');

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -SIDEBAR_WIDTH : 0;
    Animated.timing(sidebarAnim, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const channels = [
    { id: '1', name: 'general', isPrivate: false },
    { id: '2', name: 'development', isPrivate: false },
    { id: '3', name: 'announcements', isPrivate: false },
    { id: '4', name: 'design-feedback', isPrivate: true },
  ];

  const messages = [
    { id: '1', author: 'Alex', body: 'Hey everyone, check out the new mobile UI!', time: '10:30 AM' },
    { id: '2', author: 'Sam', body: 'Looks great! Is it using the same design tokens as the web app?', time: '10:32 AM' },
    { id: '3', author: 'Alex', body: 'Yes, exactly the same monochrome palette.', time: '10:33 AM' },
    { id: '4', author: 'Taylor', body: 'The dark mode aesthetics are really premium.', time: '10:35 AM' },
  ];

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Main Content */}
        <SafeAreaView style={styles.main}>
          <Header 
            channelName={channels.find(c => c.id === activeChannelId)?.name || ''}
            isPrivate={channels.find(c => c.id === activeChannelId)?.isPrivate}
            memberCount={12}
            onMenuPress={toggleSidebar}
          />
          
          <ScrollView style={styles.messageList} contentContainerStyle={styles.messageListContent}>
            {messages.map((msg) => (
              <View key={msg.id} style={styles.messageItem}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.author}>{msg.author}</Text>
                    <Text style={styles.time}>{msg.time}</Text>
                  </View>
                  <Text style={styles.body}>{msg.body}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <MessageInput onSend={(text) => console.log('Sending:', text)} />
        </SafeAreaView>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <TouchableWithoutFeedback onPress={toggleSidebar}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {/* Sidebar */}
        <Animated.View 
          style={[
            styles.sidebarWrapper, 
            { transform: [{ translateX: sidebarAnim }] }
          ]}
        >
          <Sidebar 
            workspaceName="VisionXperience"
            channels={channels}
            activeChannelId={activeChannelId}
            onChannelPress={setActiveChannelId}
            onClose={toggleSidebar}
          />
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  main: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: theme.spacing[4],
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[6],
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    marginRight: theme.spacing[3],
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  author: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.base,
    fontWeight: '700',
    marginRight: theme.spacing[2],
  },
  time: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.size.xs,
  },
  body: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.base,
    lineHeight: 20,
  },
  sidebarWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
});
