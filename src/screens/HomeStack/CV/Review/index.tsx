import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './style';
import DetailsCv from '../Details';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../../../components/Navbar';
import { useTranslation } from 'react-i18next';
import { getApplicationDetail, getCVDetail } from '../../../../services/cv';
import { lo } from '../../../../language/Resource';
import { ms } from '../../../../utils/spacing';

const CVReviewScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const applicationId = route?.params?.applied?.id;
  const [cv, setCv] = useState<any>(null);

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);
  const fetchApplicationDetails = async () => {
    console.log('applicationId', applicationId);

    try {
      const res = await getApplicationDetail(applicationId);
      console.log('rés', res);

      setCv(res.data);
    } catch (e) {}
  };

  return (
    <View style={[styles.container]}>
      <NavBar
        title={`${t('button.cv_review')}`}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.infoBlock}>
        <Text style={styles.label}>{t('label.fullname')}:</Text>
        <Text style={styles.value}>{cv?.fullName || ''}</Text>
      </View>
      <View style={styles.infoBlock}>
        <Text style={styles.label}>{t('label.phone')}:</Text>
        <Text style={styles.value}>{cv?.phoneNumber || ''}</Text>
      </View>
      <View style={styles.infoBlock}>
        <Text style={styles.label}>{t('label.mail')}:</Text>
        <Text style={styles.value}>{cv?.email || ''}</Text>
      </View>
      {/* Thêm màn chi tiết CV ngay dưới email */}
      <DetailsCv
        route={{ params: { cv } }}
        navigation={navigation}
        hideNavBar
        customStyle={{ maxHeight: ms(699) }}
      />
    </View>
  );
};

export default CVReviewScreen;
