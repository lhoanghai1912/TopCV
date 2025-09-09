import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from './styles';
import { useSelector } from 'react-redux';
import NavBar from '../../../components/Navbar';
import { spacing } from '../../../utils/spacing';
import AppStyles from '../../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import icons from '../../../assets/icons';
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../../services/noti';
import images from '../../../assets/images';

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const NotificationScreen = ({ navigation }: { navigation: any }) => {
  const { token, userId } = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 10;

  useEffect(() => {
    if (token && userId) {
      fetchNotifications(true); // Initial load
    }
  }, [token, userId]);

  const fetchNotifications = async (isRefresh = false) => {
    // Prevent multiple simultaneous calls
    if (isRefresh && loading) return;
    if (!isRefresh && (loading || loadingMore)) return;

    // Set appropriate loading state
    if (isRefresh) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    const startTime = Date.now();

    try {
      const currentPage = isRefresh ? 1 : page;
      console.log('Loading notifications for page', currentPage);

      const response = await getUserNotifications({
        userId,
        page: currentPage,
        pageSize,
      });

      console.log('noti response:', response);
      const elapsed = Date.now() - startTime;
      const minDelay = 500;
      if (elapsed < minDelay) {
        await new Promise(res => setTimeout(res, minDelay - elapsed));
      }
      if (response && response.items && response.items.length > 0) {
        if (isRefresh) {
          setNotifications(response.items);
          setPage(2); // Set next page
          setHasMore(response.items.length === pageSize);
        } else {
          setNotifications(prev => [...prev, ...response.items]);
          setPage(prev => prev + 1);
          setHasMore(response.items.length === pageSize);
        }
      } else {
        if (isRefresh) setNotifications([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      console.log('Load more triggered, current page:', page);
      fetchNotifications(false);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchNotifications(true);
  };

  const handlePressItem = async (item: Notification) => {
    // Handle notification item press
    console.log('Notification pressed', item);
    try {
      await markNotificationAsRead(item.id);
      // Update local state to mark as read
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    console.log('Mark all as read');
    try {
      await markAllNotificationsAsRead(userId);
      // Update local state to mark all as read
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: item.isRead ? '#fff' : '#f0f8ff' },
      ]}
      onPress={() => handlePressItem(item)}
    >
      <Image
        source={images.avt_default}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: spacing.medium,
        }}
      />
      <View style={styles.notificationContent}>
        <Text
          style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}
        >
          {item.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.medium,
          }}
        >
          <ActivityIndicator />
          <Text
            style={{
              marginTop: spacing.small,
              textAlign: 'center',
              fontSize: 14,
              color: '#666',
            }}
          >
            Loading more...
          </Text>
        </View>
      );
    }

    if (!hasMore && notifications.length > 0) {
      return (
        <View
          style={{
            alignItems: 'center',
            paddingVertical: spacing.medium,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
              color: '#666',
            }}
          >
            No more notifications
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={AppStyles.title}>{t('message.no_notifications')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {token ? (
        <>
          <NavBar
            title="Notifications"
            onPress={() => navigation.goBack()}
            customStyle={{ paddingHorizontal: spacing.medium }}
            icon1={icons.mark}
            onRightPress1={() => handleMarkAllAsRead()}
          />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={item => item.id.toString()}
              renderItem={renderNotificationItem}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              refreshing={false}
              onRefresh={handleRefresh}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmptyComponent}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </>
      ) : (
        <View style={styles.loginPromptContainer}>
          <Text style={AppStyles.title}>{t('message.noti_login')}</Text>
        </View>
      )}
    </View>
  );
};

export default NotificationScreen;
