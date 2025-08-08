import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle } from 'react-native';
import AppStyles from '../../../../components/AppStyle';
import icons from '../../../../assets/icons';
import images from '../../../../assets/images';
import { colors } from '../../../../utils/color';
import { link } from '../../../../utils/constants';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { formatPriceToTy } from '../../../../components/formatPrice';
import { spacing } from '../../../../utils/spacing';
import styles from './styles';

type CardJobProps = {
  job: any;
  onReload?: () => void;
  style?: ViewStyle;
};

const CardJob: React.FC<CardJobProps> = ({ job, onReload, style }) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  console.log('link', `${link.url}${job.companyLogoUrl}`);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigate(Screen_Name.DetailJob_Screen, { job })}
        style={[styles.cardJobWrapper, style]}
      >
        <View style={styles.mainContent}>
          <Image
            source={{ uri: `${link.url}${job.companyLogoUrl || job.logoUrl}` }}
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
            <Text style={styles.textInfo}>{job.location || 'abc'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.iconWrap]}
            onPress={() => setLiked(!liked)}
          >
            <Image
              source={liked ? icons.heart_like : icons.heart}
              style={[AppStyles.icon]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardJob;
