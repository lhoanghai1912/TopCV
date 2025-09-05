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
      console.log('Giá trị filePath của CV:', res.data?.filePath);
    } catch (e) {
      console.log('Lỗi khi gọi getCVDetail:', e);
    }
  };
  console.log('cvdataaaaaaa', cv);

  // const openPDF = (pdfUrl: string) => {
  //   return (
  //     <PDF
  //       source={{ uri: pdfUrl, cache: true }}
  //       style={{
  //         flex: 1,
  //         margin: 16,
  //         borderRadius: 12,
  //         backgroundColor: '#fff',
  //       }}
  //     />
  //   );
  // };
  return (
    <View style={[styles.container]}>
      <NavBar
        title={`${t('button.cv_review')}`}
        onPress={() => navigation.goBack()}
      />
      <View style={{ marginBottom: spacing.medium }}>
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
      </View>
      {/* Thêm màn chi tiết CV ngay dưới email */}
      {cvDetails?.filePath ? (
        <PDF
          // source={{ uri: `${cvDetails?.filePath}`, cache: true }}
          source={{
            uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            cache: true,
          }}
          style={{
            backgroundColor: 'red',
            flex: 1,
            marginHorizontal: spacing.medium,
            marginBottom: insets.bottom,
            borderRadius: ms(15),
          }}
        />
      ) : (
        // openPdf('http://samples.leanpub.com/thereactnativebook-sample.pdf')
        <DetailsCv
          route={{ params: { cv } }}
          navigation={navigation}
          hideNavBar
          customStyle={{ maxHeight: ms(699) }}
        />
      )}
    </View>
  );
};

export default CVReviewScreen;
