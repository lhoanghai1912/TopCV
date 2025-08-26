import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, spacing } from '../../utils/spacing';
import LinearGradient from 'react-native-linear-gradient';
import icons from '../../assets/icons';
import AppStyles from '../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './styles';
import { getJob } from '../../services/job';
import { jobList, JobSearchParams } from '../../type/type';
import { useFocusEffect } from '@react-navigation/native';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import CardJob from './Job/Card/CardJob';
import { colors } from '../../utils/color';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [listJob, setListJob] = useState<jobList[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [oderBy, setOderBy] = useState<string | undefined>();
  const [filter, setFilter] = useState<string | undefined>();
  const [search, setSearch] = useState<string | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const userData = useSelector((state: any) => state.user.userData);
  const { t } = useTranslation();

  const fetchData = async (currentPage: number, isRefresh: boolean = false) => {
    if (loadingMore && !isRefresh) return;

    if (isRefresh) {
      setIsLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params: JobSearchParams = {
        Page: currentPage.toString(),
        PageSize: pageSize.toString(),
        OderBy: oderBy,
        Filter: filter,
        Search: search,
      };

      const data = await getJob(params);
      console.log('Fetched data:', data);
      console.log('userData:', userData);

      if (data.result && Array.isArray(data.result)) {
        if (data.result.length < pageSize) {
          setNoMoreData(true);
        }

        setListJob(prevState => {
          if (isRefresh || currentPage === 1) {
            return data.result;
          } else {
            // Loại bỏ job trùng id
            const existingIds = new Set(prevState.map(job => job.id));
            const newJobs = data.result.filter(job => !existingIds.has(job.id));
            return [...prevState, ...newJobs];
          }
        });
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(1, true);
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setNoMoreData(false);
    fetchData(1, true).finally(() => setRefreshing(false));
  };

  const loadMoreData = () => {
    if (!loadingMore && !noMoreData && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  };
  const updateJobSaved = (jobId: string, isSaved: boolean) => {
    setListJob(prev =>
      prev.map(job => (job.id === jobId ? { ...job, isSaved } : job)),
    );
  };

  const renderJob = ({ item }: { item: jobList }) => {
    return <CardJob job={item} updateJobSaved={updateJobSaved} />;
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            backgroundColor: '#f0f0f0',
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.medium,
          }}
        >
          <Text>{t(`message.loadingMore`)}</Text>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }

    if (noMoreData && listJob.length > 0) {
      return (
        <View
          style={{
            paddingVertical: spacing.large,
            paddingHorizontal: spacing.medium,
            backgroundColor: '#fafafa',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {t(`message.noMoreJob`)}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#095286', '#f5f5f5']}
        style={[
          styles.header,
          { paddingTop: insets.top, height: ms(50 + insets.top) },
        ]}
      >
        <TouchableOpacity onPress={() => {}} style={styles.search}>
          <Image
            source={icons.search}
            style={[AppStyles.icon, { marginRight: spacing.small }]}
          />
          <Text style={AppStyles.text}>{t('message.job_find')}</Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.category}>
        <TouchableOpacity
          onPress={() => {
            onRefresh();
            if (flatListRef.current) {
              flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }
          }}
          style={{ alignItems: 'center' }}
        >
          <View style={styles.iconWrap}>
            <Image
              source={icons.job}
              style={[AppStyles.icon, { resizeMode: 'cover' }]}
            />
          </View>
          <Text style={[AppStyles.text, { marginTop: spacing.small }]}>
            {t(`label.job`)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignItems: 'center', marginLeft: spacing.medium }}
          onPress={() => navigate(Screen_Name.Company_Screen)}
        >
          <View style={styles.iconWrap}>
            <Image
              source={icons.company}
              style={[AppStyles.icon, { resizeMode: 'cover' }]}
            />
          </View>
          <Text style={[AppStyles.text, { marginTop: spacing.small }]}>
            {t(`label.company`)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.body, { marginBottom: ms(170) }]}>
        <FlatList
          contentContainerStyle={{
            paddingVertical: spacing.medium,
            paddingBottom: spacing.large * 2, // Thêm bottom padding để footer không bị che
          }}
          ref={flatListRef}
          data={listJob}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}>
                {t(`message.job_empty`)}
              </Text>
            ) : null
          }
          renderItem={renderJob}
          keyExtractor={(item, index) => item.id || index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
