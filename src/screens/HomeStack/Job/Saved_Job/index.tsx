import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getSavedJobs } from '../../../../services/job';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, spacing } from '../../../../utils/spacing';
import NavBar from '../../../../components/Navbar';
import { FlatList } from 'react-native-gesture-handler';
import CardJob from '../Card/CardJob';
import { colors } from '../../../../utils/color';
import AppStyles from '../../../../components/AppStyle';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
interface Props {
  navigation: any;
  route: any;
}

const SavedJobScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [listSavedJobs, setListSavedJobs] = React.useState<any>([]);
  console.log('abc', listSavedJobs);

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
        title={t('label.job_saved')}
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
                display: listSavedJobs.length ? 'flex' : 'none',
              },
            ]}
          >{`${
            listSavedJobs.length > 1
              ? `${listSavedJobs.length} ${t(`message.jobs_saved`)}`
              : `${listSavedJobs.length} ${t(`message.job_saved`)}`
          }`}</Text>
        </View>
        <FlatList
          data={listSavedJobs}
          style={{ marginBottom: ms(180) }}
          keyExtractor={item => item.id}
          renderItem={renderSavedJob}
          ListEmptyComponent={() => (
            <>
              <View style={{ alignItems: 'center', marginTop: spacing.medium }}>
                <Text style={AppStyles.title}>
                  {t(`message.job_saved_none`)}
                </Text>
              </View>
            </>
          )}
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

export default SavedJobScreen;
