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
import { jobList, SearchParams } from '../../type/type';
import { useFocusEffect } from '@react-navigation/native';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import CardJob from './Job/Card/CardJob';
import { colors } from '../../utils/color';
import AppInput from '../../components/AppInput';
import { TextInput } from 'react-native-gesture-handler';
const pageSize = 10;

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [listJob, setListJob] = useState<jobList[]>([]);
  const [page, setPage] = useState(1);
  const [oderBy, setOderBy] = useState<string | undefined>('createdAt desc');
  const [filter, setFilter] = useState<string | undefined>();
  const [search, setSearch] = useState<string>(''); // tránh undefined gây re-render không cần
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const userData = useSelector((state: any) => state.user.userData);
  const { t } = useTranslation();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const loadingRef = useRef(false); // chặn gọi lặp
  const didMountRef = useRef(false); // tránh debounce gọi ngay sau focus
  const onEndReachedCalledDuringMomentum = useRef(false);
  const fetchData = useCallback(
    async (
      currentPage: number,
      currentSearch: string,
      isRefresh: boolean = false,
    ) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      if (isRefresh) {
        setIsLoading(true);
        setLoadingMore(false);
      } else {
        setLoadingMore(true);
      }

      try {
        const params: SearchParams = {
          Page: currentPage.toString(),
          PageSize: pageSize.toString(),
          OderBy: oderBy,
          Filter: filter,
          Search: currentSearch || undefined,
        };
        console.log('userData', userData);

        console.log('Fetch params:', params);
        const data = await getJob(params);

        if (data.result && Array.isArray(data.result)) {
          if (data.result.length < pageSize) setNoMoreData(true);
          setListJob(prev => {
            if (isRefresh || currentPage === 1) {
              setNoMoreData(data.result.length < pageSize);
              return data.result;
            }
            const ids = new Set(prev.map(j => j.id));
            const merged = data.result.filter(j => !ids.has(j.id));
            return [...prev, ...merged];
          });
        }
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
        setLoadingMore(false);
      }
    },
    [oderBy, filter], // loại isLoading / loadingMore để không re-create
  );

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setNoMoreData(false);
      fetchData(1, search, true);
    }, [fetchData]), // không phụ thuộc search để tránh spam
  );

  useEffect(() => {
    // Bỏ lượt đầu (đã fetch trong focus)
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      console.log('[Search debounce]', search);
      setPage(1);
      setNoMoreData(false);
      fetchData(1, search, true);
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, fetchData]);

  const onSubmitSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    console.log('[Search submit]', search);
    setPage(1);
    setNoMoreData(false);
    fetchData(1, search, true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setSearch('');
    setNoMoreData(false);
    fetchData(1, search, true).finally(() => setRefreshing(false));
  };

  const loadMoreData = () => {
    // if (page === 1) return; // 👈 chặn lần gọi đầu tiên
    if (loadingRef.current || loadingMore || noMoreData || isLoading) return;
    const next = page + 1;
    setPage(next);
    fetchData(next, search, false);
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

    if (!isLoading && noMoreData && listJob.length > 0) {
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
          {
            //  height: ms(insets.top)
            paddingTop: insets.top + spacing.small,
          },
        ]}
      >
        <TouchableOpacity onPress={() => {}} style={styles.search}>
          <Image
            source={icons.search}
            style={[AppStyles.icon, { marginRight: spacing.small }]}
          />
          <TextInput
            style={[
              AppStyles.text,
              {
                width: '90%',
              },
            ]}
            placeholder={t('message.job_find')}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
          />
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
            !isLoading && listJob.length === 0 ? (
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
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              loadMoreData();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
