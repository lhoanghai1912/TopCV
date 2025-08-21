import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getSavedJobs } from '../../../../services/job';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../../../utils/spacing';
import NavBar from '../../../../components/Navbar';
import { FlatList } from 'react-native-gesture-handler';
import CardJob from '../Card/CardJob';
import { colors } from '../../../../utils/color';
import AppStyles from '../../../../components/AppStyle';
import { useSelector } from 'react-redux';
interface Props {
  navigation: any;
  route: any;
}

const SavedJobScreen: React.FC<Props> = ({ navigation, route }) => {
  const updateJobSaved = (id: number, isSaved: boolean) => {
    if (!isSaved) {
      setListSavedJobs(prev => prev.filter(job => job.id !== id));
    } else {
      setListSavedJobs(prev =>
        prev.map(job => (job.id === id ? { ...job, isSaved } : job)),
      );
    }
  };
  const insets = useSafeAreaInsets();
  const token = useSelector((state: any) => state.user.token);
  const [listSavedJobs, setListSavedJobs] = React.useState<any>([]);

  useEffect(() => {
    fetchListSavedJobs();
  }, []);

  const fetchListSavedJobs = async () => {
    const res = await getSavedJobs();
    setListSavedJobs(res.data?.result);
    console.log('list saved job', res);
  };
  const renderSavedJob = ({ item }: { item: any }) => {
    return (
      <View>
        <CardJob
          job={item}
          updateJobSaved={(id, isSaved) => updateJobSaved(Number(id), isSaved)}
        />
      </View>
    );
  };
  console.log('data', listSavedJobs);

  return (
    <View style={[styles.container]}>
      <NavBar
        title="Saved Jobs"
        onPress={() => {
          navigation.goBack();
        }}
        customStyle={[{ marginBottom: spacing.medium }]}
      />
      <FlatList
        data={listSavedJobs}
        keyExtractor={item => item.id}
        renderItem={renderSavedJob}
        ListEmptyComponent={() => (
          <>
            <View style={{ alignItems: 'center', marginTop: spacing.medium }}>
              <Text style={AppStyles.title}>No saved jobs found</Text>
            </View>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
    flex: 1,
  },
});

export default SavedJobScreen;
