import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, RefreshControl, FlatList } from 'react-native';
import styles from './styles';
import NavBar from '../../../components/Navbar';
import icons from '../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { SearchParams } from '../../../type/type';
import { getCompany } from '../../../services/company';
import { useFocusEffect } from '@react-navigation/native';
import CardCompany from './CardCompany';
import AppStyles from '../../../components/AppStyle';
import AppInput from '../../../components/AppInput';
import { spacing } from '../../../utils/spacing';

const pageSize = 10;

const CompanyScreen = ({ navigation }: { navigation: any }) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const { t } = useTranslation();
  const [oderBy, setOderBy] = useState<string | undefined>('createdAt desc');
  const [filter, setFilter] = useState<string | undefined>();
  const [search, setSearch] = useState<string | undefined>('');
  const [searching, setSearching] = useState(false);
  const fetchCompanies = async (
    currentPage: number,
    isRefresh: boolean = false,
  ) => {
    if (loading || loadingMore) return;
    if (isRefresh) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const params: SearchParams = {
        Page: currentPage.toString(),
        PageSize: pageSize.toString(),
        OderBy: oderBy,
        Filter: filter,
        Search: search,
      };
      const data = await getCompany(params);
      console.log('company page', currentPage, ':', data);

      if (data.result && Array.isArray(data.result)) {
        // Kiểm tra nếu không có data hoặc data ít hơn pageSize
        if (data.result.length === 0 || data.result.length < pageSize) {
          setNoMoreData(true);
        }

        setCompanies(prevState => {
          if (isRefresh || currentPage === 1) {
            // Reset noMoreData khi refresh hoặc load page đầu
            setNoMoreData(data.result.length < pageSize);
            return data.result;
          } else {
            // Loại bỏ company trùng id
            const existingIds = new Set(prevState.map(company => company.id));
            const newCompanies = data.result.filter(
              company => !existingIds.has(company.id),
            );
            return [...prevState, ...newCompanies];
          }
        });
      }
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false); // Thêm dòng này để handle refreshing state
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setNoMoreData(false);
      fetchCompanies(1, true);
    }, [search, filter, oderBy]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setNoMoreData(false);
    fetchCompanies(1, true);
    setSearch('');
  };
  const handleLoadMore = () => {
    if (!loadingMore && !noMoreData && !loading) {
      const nextPage = page + 1;
      console.log('nextPage', nextPage);
      setPage(nextPage);

      fetchCompanies(nextPage, false);
    }
  };

  const updatedCompanyFollowed = (companyId: string, isFollowed: boolean) => {
    setCompanies(prev =>
      prev.map(item =>
        item.id === companyId ? { ...item, isFollowing: isFollowed } : item,
      ),
    );
  };

  const renderCompany = ({ item }: { item: any }) => {
    return (
      <CardCompany
        company={item}
        updateCompanyFollowed={updatedCompanyFollowed}
      />
    );
  };

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
        title={t('label.company_title')}
        onPress={() => navigation.goBack()}
        icon1={icons.search}
        onRightPress1={() => {
          setSearching(!searching), setSearch('');
        }}
      />
      <View style={[styles.body]}>
        {searching && (
          <AppInput
            style={{
              borderWidth: 1,
              borderRadius: 15,
              paddingHorizontal: spacing.medium,
            }}
            clearStyle={{ right: spacing.medium }}
            onChangeText={text => setSearch(text)}
            value={search}
            autoFocus={true}
          />
        )}
        <FlatList
          style={{ marginTop: spacing.medium }}
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
            !loading ? (
              <Text style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}>
                {t('message.company_empty')}
              </Text>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default CompanyScreen;
