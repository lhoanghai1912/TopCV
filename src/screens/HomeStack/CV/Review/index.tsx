import React, { use, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './style';
import DetailsCv from '../Details';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../../../components/Navbar';
import { useTranslation } from 'react-i18next';
import { getApplicationDetail, getCVDetail } from '../../../../services/cv';
import { ms, spacing } from '../../../../utils/spacing';
import PDF from 'react-native-pdf';
import { link } from '../../../../utils/constants';
import { colors } from '../../../../utils/color';
const CVReviewScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const applicationId = route?.params?.applied?.id;
  const [cv, setCv] = useState<any>(null);
  const [cvDetails, setCvDetails] = useState<any>(null);
  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);
  const fetchApplicationDetails = async () => {
    console.log('applicationId', applicationId);
    try {
      const res = await getApplicationDetail(applicationId);
      console.log('Kết quả getApplicationDetail:', res);
      setCv(res.data);
    } catch (e) {
      console.log('Lỗi khi gọi getApplicationDetail:', e);
    }
  };

  useEffect(() => {
    if (cv?.cvId) {
      fetchCVDetails();
    }
  }, [cv?.cvId]);

  const fetchCVDetails = async () => {
    try {
      const res = await getCVDetail(cv.cvId);
      setCvDetails(res.data);
      console.log(`Giá trị filePath của CV:, ${link.url}${res.data?.filePath}`);
    } catch (e) {
      console.log('Lỗi khi gọi getCVDetail:', e);
    }
  };
  console.log('cvdataaaaaaa', cv);

  return (
    <View style={[styles.container]}>
      <NavBar
        title={`${t('button.cv_review')}`}
        onPress={() => navigation.goBack()}
      />
      {/* Thêm màn chi tiết CV ngay dưới email */}
      {cvDetails?.filePath ? (
        <PDF
          fitPolicy={2}
          trustAllCerts={false}
          source={{
            uri: `${link.url}${cvDetails?.filePath}`,
            cache: true,
          }}
          style={{
            backgroundColor: colors.white,
            flex: 1,
            margin: spacing.small,
            marginBottom: ms(insets.bottom + spacing.medium),
            borderWidth: 1,
            borderRadius: ms(15),
          }}
        />
      ) : (
        <DetailsCv
          route={{ params: { cv } }}
          navigation={navigation}
          hideNavBar
          customStyle={{ maxHeight: ms(800) }}
        />
      )}
    </View>
  );
};

export default CVReviewScreen;
