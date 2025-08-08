import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, FlatList } from 'react-native';
import styles from './styles';
import NavBar from '../../../components/Navbar';
import icons from '../../../assets/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { JobSearchParams } from '../../../type/type';
import { getCompany } from '../../../services/company';
import { useFocusEffect } from '@react-navigation/native';
import CardCompany from './CardCompany';
import { spacing } from '../../../utils/spacing';
import AppStyles from '../../../components/AppStyle';

interface Props {
  navigation: any;
}

const CompanyScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [listCompany, setListCompany] = useState<any[]>([]);
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
  const token = useSelector((state: any) => state.user.token);
  const { t } = useTranslation();

  // Fetch data function
  const fetchData = async (currentPage: number, isRefresh: boolean = false) => {
    if (loadingMore && !isRefresh) return; // Avoid multiple fetch calls

    setIsLoading(!isRefresh);
    setLoadingMore(!isRefresh);

    try {
      const params: JobSearchParams = {
        Page: currentPage.toString(),
        PageSize: pageSize.toString(),
        OderBy: oderBy,
        Filter: filter,
        Search: search,
      };

      const data = await getCompany();
      console.log('data', data);

      console.log('Fetched data:', data);

      if (data.data && Array.isArray(data.data)) {
        if (data.data.length < pageSize) {
          setNoMoreData(true);
        }

        setListCompany(prevState => {
          if (isRefresh || currentPage === 1) {
            return data.data;
          } else {
            return [...prevState, ...data.data];
          }
        });
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch and refetch when screen is focused
  useEffect(() => {
    fetchData(1, true);
  }, []);

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

  // Load more data
  const loadMoreData = () => {
    if (!loadingMore && !noMoreData && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  };

  // Render each company
  // Đảm bảo rằng bạn sử dụng đúng tham số trong renderItem
  const renderCompany = ({ item }: { item: any }) => {
    return (
      <>
        <View>
          <CardCompany company={item} key={item.id} />
        </View>
      </>
    );
  };

  // Footer component
  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <Text style={styles.loadingText}>{t('message.loadingMore')}</Text>
        </View>
      );
    }
    if (noMoreData && listCompany.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text style={styles.noMoreText}>{t('message.noMoreJob')}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <NavBar
        title={`Thương hiệu lớn tiêu biểu`}
        onPress={() => navigation.goBack()}
        icon1={icons.search}
      />
      <View style={[styles.body]}>
        <FlatList
          ref={flatListRef}
          data={listCompany}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}>
                {t('message.noData')}
              </Text>
            ) : null
          }
          renderItem={renderCompany}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          //   onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default CompanyScreen;
