import React, { use, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle } from 'react-native';
import AppStyles from '../../../../components/AppStyle';
import icons from '../../../../assets/icons';
import { link } from '../../../../utils/constants';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { formatPriceToTy } from '../../../../components/formatPrice';
import { spacing } from '../../../../utils/spacing';
import styles from './styles';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { patchSavedJob } from '../../../../services/job';

type CardJobProps = {
  job: any;
  updateJobSaved?: (jobId: string, isSaved: boolean) => void;
};

const CardJob: React.FC<CardJobProps> = ({ job, updateJobSaved }) => {
  const { t } = useTranslation();
  const token = useSelector((state: any) => state.user.token);
  const [isSaved, setIsSaved] = useState(job.isSaved);

  useEffect(() => {
    setIsSaved(job.isSaved);
  }, [job.isSaved]);

  const handleSavedJob = async (jobId: string) => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: t('message.job_login'),
      });
    } else {
      const res = await patchSavedJob(jobId);
      setIsSaved(prev => !prev);
      if (typeof updateJobSaved === 'function') updateJobSaved(jobId, !isSaved);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigate(Screen_Name.DetailJob_Screen, { job })}
        style={[styles.cardJobWrapper]}
      >
        <View style={styles.mainContent}>
          <Image
            source={{
              uri: /^https?:\/\//.test(job.companyLogoUrl || job.logoUrl)
                ? job.companyLogoUrl || job.logoUrl
                : `${link.url}${job.companyLogoUrl || job.logoUrl}`,
            }}
            style={styles.companyImage}
          />
          <View style={styles.jobInfo}>
            <Text style={[AppStyles.title]} numberOfLines={2}>
              {job.title}
            </Text>
            <Text style={[AppStyles.text]} numberOfLines={1}>
              {job.companyName}
            </Text>
          </View>
        </View>
        <View style={styles.description}>
          <View
            style={{
              flexDirection: 'row',
              width: '80%',
            }}
          >
            <Text
              style={[styles.textInfo, { marginRight: spacing.small }]}
            >{`${formatPriceToTy(job.salaryFrom)} - ${formatPriceToTy(
              job.salaryTo,
            )}`}</Text>
            <Text
              numberOfLines={1}
              style={[styles.textInfo, { flexShrink: 1, minWidth: 0 }]}
            >
              {job.location || 'abc'}{' '}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.iconWrap]}
            onPress={() => handleSavedJob(job.id)}
          >
            <Image
              source={isSaved ? icons.heart_like : icons.heart}
              style={[AppStyles.icon]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardJob;
