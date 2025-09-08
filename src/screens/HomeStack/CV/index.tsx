import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import NavBar from '../../../components/Navbar';
import { getCVList } from '../../../services/cv';
import CardCV from './Card';
import { ms, spacing } from '../../../utils/spacing';
import AppButton from '../../../components/AppButton';
import { Screen_Name } from '../../../navigation/ScreenName';
import { useTranslation } from 'react-i18next';
import AppStyles from '../../../components/AppStyle';
import { useSelector } from 'react-redux';

const PAGE_SIZE = 10;

const CVScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { t } = useTranslation();
  const [listCV, setListCV] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0); // Thêm state cho tổng số bản ghi
  const { token } = useSelector((state: any) => state.user);
  useEffect(() => {
    if (token) {
      fetchListCV();
    }
  }, [token]);

  const fetchListCV = async (refresh = false) => {
    if (loading) return;
    setLoading(true);
    const startTime = Date.now();
    try {
      const currentPage = refresh ? 1 : page;
      const data = await getCVList(currentPage, PAGE_SIZE);
      console.log(`CV trang ${currentPage}:`, data.result);

      if (data && data.total !== undefined) {
        setTotalCount(data.total);
      }

      const elapsed = Date.now() - startTime;
      const minDelay = 500;
      if (elapsed < minDelay) {
        await new Promise(res => setTimeout(res, minDelay - elapsed));
      }
      if (data && data.result && data.result.length > 0) {
        if (refresh) {
          setListCV(data.result);
          setPage(2);
          setHasMore(true);
        } else {
          setListCV(prev => [...prev, ...data.result]);
          setPage(prev => prev + 1);
          if (data.result.length < PAGE_SIZE) setHasMore(false);
        }
      } else {
        if (refresh) setListCV([]);
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchListCV();
    }
  };

  const handleRefresh = () => {
    fetchListCV(true);
  };

  const pickMode = route?.params?.pickMode;
  const onPickCV = route?.params?.onPickCV;
  const renderCardCV = ({ item }: { item: any }) => {
    return (
      <CardCV
        cv={item}
        onPress={
          pickMode && typeof onPickCV === 'function'
            ? (cvId: string) => {
                onPickCV(cvId);
                navigation.goBack();
              }
            : undefined
        }
      />
    );
  };

  return (
    <>
      {token ? (
        <View style={styles.container}>
          <NavBar title={'CV'} onPress={() => navigation.goBack()} />
          <View
            style={{
              marginBottom: spacing.medium,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing.medium,
            }}
          >
            <Text style={AppStyles.label}>{`${
              totalCount > 1
                ? `${totalCount} ${t('label.cv_lists')}`
                : `${totalCount} ${t('label.cv_list')}`
            }`}</Text>
            <AppButton
              title={t('button.createCV')}
              onPress={() => navigation.navigate(Screen_Name.CreateCV_Screen)}
            />
          </View>
          <FlatList
            data={listCV}
            style={{
              borderWidth: 1,
              paddingVertical: spacing.medium,
              marginHorizontal: spacing.medium,
              borderRadius: 15,
              maxHeight: ms(780),
            }}
            keyExtractor={item => item.id.toString()}
            renderItem={renderCardCV}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loading && !listCV.length ? (
                <ActivityIndicator />
              ) : loading && listCV.length ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing.medium,
                  }}
                >
                  <ActivityIndicator />
                  <Text
                    style={{
                      paddingBottom: spacing.medium,
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: spacing.medium,
                    }}
                  >
                    Đang tải thêm...
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    marginBottom: spacing.medium,
                  }}
                >
                  <Text
                    style={{
                      paddingBottom: spacing.medium,
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: spacing.medium,
                    }}
                  >
                    No more cv
                  </Text>
                </View>
              )
            }
            refreshing={loading && page === 2}
            onRefresh={handleRefresh}
          />
        </View>
      ) : (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text style={AppStyles.title}>{t('message.cv_login')}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: spacing.medium,
  },
});

export default CVScreen;
