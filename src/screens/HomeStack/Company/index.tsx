import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, RefreshControl, FlatList } from 'react-native';
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
import AppStyles from '../../../components/AppStyle';
import LoadingScreen from '../../../components/Loading';

const PAGE_SIZE = 10;

const CompanyScreen = ({ navigation }: { navigation: any }) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const { t } = useTranslation();

  const fetchCompanies = async (pageNum = 1, isRefresh = false) => {
    if (loading || loadingMore) return;
    if (isRefresh) {
      setRefreshing(true);
      setNoMoreData(false);
    } else if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const params: JobSearchParams = {
        Page: pageNum.toString(),
        PageSize: PAGE_SIZE.toString(),
      };
      const data = await getCompany(params);
      const result = data?.result || [];
      if (isRefresh || pageNum === 1) {
        setCompanies(result);
      } else {
        setCompanies(prev => [...prev, ...result]);
      }
      if (result.length < PAGE_SIZE) {
        setNoMoreData(true);
      }
      setPage(pageNum);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCompanies(1, true);
    }, []),
  );

  const handleRefresh = () => {
    fetchCompanies(1, true);
  };

  const handleLoadMore = () => {
    if (loading || loadingMore || refreshing || noMoreData) return;
    if (companies.length >= PAGE_SIZE) {
      fetchCompanies(page + 1, false);
    }
  };

  const renderCompany = ({ item }: { item: any }) => (
    <CardCompany company={item} key={item.id || item._id || Math.random()} />
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <Text style={styles.loadingText}>{t('message.loadingMore')}</Text>
        </View>
      );
    }
    if (noMoreData && companies.length > 0) {
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
        title={'Thương hiệu lớn tiêu biểu'}
        onPress={() => navigation.goBack()}
        icon1={icons.search}
      />
      <View style={[styles.body]}>
        <FlatList
          data={companies}
          renderItem={renderCompany}
          keyExtractor={(item, index) =>
            item.id
              ? item.id.toString()
              : item._id
              ? item._id.toString()
              : `company_${index}`
          }
          ListEmptyComponent={
            loading ? (
              <LoadingScreen />
            ) : (
              <Text style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}>
                {t('message.noData')}
              </Text>
            )
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default CompanyScreen;
