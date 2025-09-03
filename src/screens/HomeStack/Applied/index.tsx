import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAppliedJobs } from '../../../services/job';
import NavBar from '../../../components/Navbar';
import { ms, spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';
import AppStyles from '../../../components/AppStyle';
import CardApply from './CardApply';
interface Props {
  navigation: any;
  route: any;
}
const PAGE_SIZE = 10;

const AppliedScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [listAppliedJobs, setListAppliedJobs] = React.useState<any>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchListAppliedJobs(true);
  }, []);

  const fetchListAppliedJobs = async (refresh = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentPage = refresh ? 1 : page;

      // Giả sử getAppliedJobs nhận page, pageSize
      const res = await getAppliedJobs(currentPage, PAGE_SIZE);
      console.log(res);

      console.log(`CV trang ${currentPage}:`, res.result);
      if (res && res.result && res.result.length > 0) {
        if (refresh) {
          setListAppliedJobs(res.result);
          setPage(2);
          setHasMore(true);
        } else {
          setListAppliedJobs(prev => [...prev, ...res.result]);
          setPage(prev => prev + 1);
          if (res.result.length < PAGE_SIZE) setHasMore(false);
        }
      } else {
        if (refresh) setListAppliedJobs([]);
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchListAppliedJobs();
    }
  };
  const handleRefresh = () => {
    fetchListAppliedJobs(true);
  };

  const renderAppliedJob = ({ item }: { item: any }) => {
    return (
      <View>
        <CardApply applied={item} />
      </View>
    );
  };
  console.log('data', listAppliedJobs);

  return (
    <View style={[styles.container]}>
      <NavBar
        title={t('label.job_applied')}
        onPress={() => {
          navigation.goBack();
        }}
        customStyle={{
          marginBottom: spacing.medium,
          backgroundColor: colors.white,
          paddingTop: ms(50 + insets.top),
        }}
      />
      <View>
        <View>
          <Text
            style={[
              AppStyles.title,
              {
                paddingLeft: spacing.medium,
                marginBottom: spacing.small,
                display: listAppliedJobs?.total ? 'flex' : 'none',
              },
            ]}
          >{`${
            listAppliedJobs?.total > 1
              ? `${listAppliedJobs?.total} ${t(`message.job_applied`)}`
              : `${listAppliedJobs?.total} ${t(`message.jobs_applied`)}`
          }`}</Text>
        </View>
        <FlatList
          data={listAppliedJobs}
          style={{ marginBottom: ms(150) }}
          keyExtractor={item => item.id}
          renderItem={renderAppliedJob}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loading && !listAppliedJobs.length ? (
              <ActivityIndicator />
            ) : loading && listAppliedJobs.length ? (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppliedScreen;
