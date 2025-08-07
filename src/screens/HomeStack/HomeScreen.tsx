import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, spacing } from '../../utils/spacing';
import LinearGradient from 'react-native-linear-gradient';
import icons from '../../assets/icons';
import AppStyles from '../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Card from './Card';
import styles from './styles';
import { getJob } from '../../services/job';
import { jobList, JobSearchParams } from '../../type/type';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [listJob, setListJob] = useState([]);
  const [page, setPage] = useState('1');
  const [pageSize, setPageSize] = useState('20');
  const [oderBy, setOderBy] = useState();
  const [filter, setFilter] = useState();
  const [search, setSearch] = useState();
  const [refreshing, setRefreshing] = useState(false); // State to track refreshing
  const [loadingMore, setLoadingMore] = useState(false); // State to track loading more
  const flatListRef = useRef<FlatList>(null);
  const token = useSelector((state: any) => state.user.token);
  const { t } = useTranslation();
  const params: JobSearchParams = {
    Page: page,
    PageSize: pageSize,
    OderBy: oderBy,
    Filter: filter,
    Search: search,
  };
  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      onRefresh(); // Call onRefresh when screen is focused
    }, []),
  );

  const fetchData = async () => {
    const data = await getJob(params);
    setListJob(data.result);
    console.log('datta', data);
  };

  const onRefresh = () => {
    // flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setRefreshing(true); // Set refreshing to true
    fetchData().finally(() => setRefreshing(false)); // Fetch data and stop refreshing once done
  };

  const renderJob = ({ item }: { item: jobList }) => {
    const key = item.id ? item.id.toString() : `${Math.random()}`;
    return (
      <>
        <Card job={item} key={key} />
        <View style={{ marginBottom: spacing.medium }} />
      </>
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#095286', '#f5f5f5']} // Gradient từ xanh -> trắng
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <TouchableOpacity onPress={() => {}} style={styles.search}>
          <Image
            source={icons.search}
            style={[AppStyles.icon, { marginRight: spacing.small }]}
          />
          <Text style={AppStyles.text}>{t('message.find')}</Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.category}>
        <TouchableOpacity></TouchableOpacity>
      </View>
      <View style={[styles.body]}>
        {/* <Card /> */}
        <FlatList
          ref={flatListRef}
          data={listJob}
          ListEmptyComponent={
            <Text style={[AppStyles.label, { flex: 1, textAlign: 'center' }]}>
              No data
            </Text>
          }
          renderItem={renderJob}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

export default HomeScreen;
