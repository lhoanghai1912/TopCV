import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import NavBar from '../../../components/Navbar';
import { getCVList } from '../../../services/cv';
import CardCV from './Card';
import { spacing } from '../../../utils/spacing';
import AppButton from '../../../components/AppButton';
import { Screen_Name } from '../../../navigation/ScreenName';

const PAGE_SIZE = 10;

const CVScreen = ({ navigation }: { navigation: any }) => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchListCV();
  }, []);

  const fetchListCV = async (refresh = false) => {
    if (loading) return;
    setLoading(true);
    const startTime = Date.now();
    try {
      const currentPage = refresh ? 1 : page;
      const data = await getCVList(currentPage, PAGE_SIZE);
      console.log(`CV trang ${currentPage}:`, data.result);

      const elapsed = Date.now() - startTime;
      const minDelay = 1000;
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

  const renderCardCV = ({ item }: { item: any }) => {
    return <CardCV cv={item} />;
  };

  return (
    <View style={styles.container}>
      <NavBar title={'CV'} onPress={() => navigation.goBack()} />
      <View style={{ marginBottom: spacing.medium, flexDirection: 'row' }}>
        <Text>{`Your CV: `}</Text>
        <AppButton
          title="button.createCV"
          onPress={() => navigation.navigate(Screen_Name.CreateCV_Screen)}
        />
      </View>
      <FlatList
        data={listCV}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCardCV}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading && !listCV.length ? (
            <ActivityIndicator />
          ) : loading && listCV.length ? (
            <View style={{ alignItems: 'center', padding: 16 }}>
              <ActivityIndicator />
              <Text style={{ marginTop: 8 }}>Đang tải thêm...</Text>
            </View>
          ) : null
        }
        refreshing={loading && page === 2}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CVScreen;
