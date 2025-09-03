import React, { use, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle } from 'react-native';
import AppStyles from '../../../../components/AppStyle';
import icons from '../../../../assets/icons';
import { link } from '../../../../utils/constants';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';

import { useSelector } from 'react-redux';
import styles from './styles';
import moment from 'moment';
import AppButton from '../../../../components/AppButton';
import { formatPriceToTy } from '../../../../components/formatPrice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CardApplyProps = {
  applied: any;
  updateJobSaved?: (appliedId: string, isSaved: boolean) => void;
};

const CardApply: React.FC<CardApplyProps> = ({ applied, updateJobSaved }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const token = useSelector((state: any) => state.user.token);

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => navigate(Screen_Name.DetailJob_Screen, { applied })}
        style={[styles.cardJobWrapper]}
      >
        <View style={styles.mainContent}>
          <Image
            source={{
              uri: /^https?:\/\//.test(applied.companyLogo || applied.logoUrl)
                ? applied.companyLogo || applied.logoUrl
                : `${link.url}${applied.companyLogo || applied.logoUrl}`,
            }}
            style={styles.companyImage}
          />
          <View style={styles.appliedInfo}>
            <Text style={[AppStyles.title]} numberOfLines={2}>
              {applied.jobTitle}
            </Text>
            <Text style={[AppStyles.text]} numberOfLines={1}>
              {applied.companyName}
            </Text>
          </View>
        </View>
        <View style={styles.description}>
          <View style={styles.description_item}>
            <Image source={icons.location} style={styles.icon} />
            <Text style={AppStyles.text}>{`${applied.location}`}</Text>
          </View>
          <View
            style={[
              styles.description_item,
              { justifyContent: 'space-between' },
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',

                width: '58%',
              }}
            >
              <Image source={icons.salary} style={styles.icon} />
              <Text
                style={[AppStyles.text, { width: '80%' }]}
              >{`${formatPriceToTy(applied.salaryFrom)} - ${formatPriceToTy(
                applied.salaryTo,
              )}`}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',

                width: '40%',
              }}
            >
              <Image source={icons.clock} style={styles.icon} />
              <Text style={AppStyles.text}>{`${moment(applied.appliedAt).format(
                `DD/MM/YYYY`,
              )}`}</Text>
            </View>
          </View>
          <AppButton
            title={t('button.cv_review')}
            onPress={() => navigate(Screen_Name.CV_Review_Screen, { applied })}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardApply;
