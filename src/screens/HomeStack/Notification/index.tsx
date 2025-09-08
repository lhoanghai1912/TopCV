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
  const [refreshing, setRefreshing] = useState(false);

  const pageSize = 20;
  console.log('userId', userId);

  const loadNotifications = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await getUserNotifications({
          userId,
          page: pageNum,
          pageSize,
        });
        console.log('noti', response);
        if (isRefresh || pageNum === 1) {
          setNotifications(response.items || []);
        } else {
          setNotifications(prev => [...prev, ...(response.items || [])]);
        }

        // Check if there are more items to load
        if (!response.items || response.items.length < pageSize) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (token && userId) {
      loadNotifications(1);
    }
  }, [token, userId, loadNotifications]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadNotifications(1, true);
  };

  const handlePressItem = (item: Notification) => {
    // Handle notification item press
    console.log('Notification pressed', item);
    const res = markNotificationAsRead(item.id);
  };

  const handleMarkAllAsRead = async () => {
    console.log('Mark all as read');
    const res = await markAllNotificationsAsRead(userId);
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
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
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
              refreshing={refreshing}
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
