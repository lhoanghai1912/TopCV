import React, { use, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  AppState,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { getCVDetail } from '../../../../services/cv';
import NavBar from '../../../../components/Navbar';
import { link } from '../../../../utils/constants';
import images from '../../../../assets/images';
import { ms, spacing } from '../../../../utils/spacing';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../../../../utils/color';
import { Fonts } from '../../../../utils/fontSize';
import icons from '../../../../assets/icons';
import AppStyles from '../../../../components/AppStyle';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { formatDateForDisplay } from '../../../../utils/formatDateForDisplay';
import { useTranslation } from 'react-i18next';
interface Props {
  navigation: any;
  route: any;
  hideNavBar?: boolean;
  customStyle?: ViewStyle;
}

const DetailsCv: React.FC<Props> = ({
  route,
  navigation,
  hideNavBar,
  customStyle,
}) => {
  const { t } = useTranslation();
  const cvId = route.params?.cv?.cvId;
  const [cv, setCv] = React.useState<any>(null);
  useEffect(() => {
    if (cvId) {
      fetchCVDetails();
    }
  }, [cvId]);
  const fetchCVDetails = async () => {
    try {
      const res = await getCVDetail(cvId);
      setCv(res.data);
      console.log('details', res);
    } catch (error) {}
  };
  if (!cv) {
    return (
      <View style={styles.container}>
        {!hideNavBar && (
          <NavBar title={`CV Details`} onPress={() => navigation.goBack()} />
        )}
      </View>
    );
  }

  const {
    photoCard,
    name,
    content,
    birthday,
    gender,
    phone,
    email,
    website,
    address,
    educations = [],
    experiences = [],
    certifications = [],
    skills = [],
    sections = [],
    title,
  } = cv;

  return (
    <View style={[styles.container, customStyle]}>
      {!hideNavBar && (
        <NavBar title={`CV Details`} onPress={() => navigation.goBack()} />
      )}
      <View style={styles.body}>
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={
                photoCard
                  ? { uri: `${link.url}${photoCard}` }
                  : images.avt_default
              }
              style={{
                width: ms(150),
                height: ms(150),
                borderRadius: 100,
                backgroundColor: '#eee',
              }}
            />
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 8 }}>
              {name}
            </Text>
            <Text style={{ color: '#555', fontSize: Fonts.normal }}>
              {content}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Screen_Name.CreateCV_Screen, { cv })
              }
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                display: hideNavBar ? 'none' : 'flex',
              }}
            >
              <Image source={icons.edit} style={[AppStyles.icon]} />
            </TouchableOpacity>
          </View>
          <View style={[styles.bodyContent, { borderTopWidth: 0 }]}>
            <Text style={styles.sectionTitle}>{t(`label.cv_info`)}</Text>
            <Text>
              {t('label.cv_dob')}:{' '}
              {birthday ? formatDateForDisplay(birthday) : ''}
            </Text>
            <Text>
              {t('label.cv_gender')}: {gender}
            </Text>
            <Text>
              {t('label.cv_phone')}: {phone}
            </Text>
            <Text>
              {t('label.cv_email')}: {email}
            </Text>
            <Text>
              {t('label.cv_website')}: {website}
            </Text>
            <Text>
              {t('label.cv_address')}: {address}
            </Text>
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>{t('label.cv_education')}</Text>
            {Array.isArray(educations) && educations.length > 0 ? (
              educations.map((edu, idx) => (
                <View
                  style={{ flexDirection: 'row', marginBottom: spacing.medium }}
                  key={idx}
                >
                  <View style={{ width: '35%' }}>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {edu.startDate && edu.endDate
                        ? `${formatDateForDisplay(
                            edu.startDate,
                          )} - ${formatDateForDisplay(edu.endDate)}`
                        : 'Bắt đầu - Kết thúc'}
                    </Text>
                  </View>
                  <View style={{ flexShrink: 1, width: '70%' }}>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t(`label.cv_institution`)}: ${edu.institutionName}`}
                    </Text>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t(`label.cv_field_of_study`)} ${edu.fieldOfStudy}`}
                    </Text>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t(`label.cv_degree`)}: ${edu.degree}`}
                    </Text>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t(`label.cv_edu_description`)}: ${edu.description}`}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>{t('message.cv_no_education_info')}</Text>
            )}
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>{t('label.cv_experience')}</Text>
            {Array.isArray(experiences) && experiences.length > 0 ? (
              experiences.map((exp, idx) => (
                <View
                  key={idx}
                  style={{ flexDirection: 'row', marginBottom: spacing.medium }}
                >
                  <View style={{ width: '35%' }}>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {exp.startDate && exp.endDate
                        ? `${formatDateForDisplay(
                            exp.startDate,
                          )} - ${formatDateForDisplay(exp.endDate)}`
                        : 'Bắt đầu - Kết thúc'}
                    </Text>
                  </View>
                  <View style={{ flexShrink: 1, width: '70%' }}>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t(`label.cv_company`)}: ${exp.companyName}`}
                    </Text>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t(`label.cv_job_title`)}: ${exp.jobTitle}`}
                    </Text>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t(`label.cv_job_description`)}: ${exp.description}`}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>{t('message.cv_no_experience_info')}</Text>
            )}
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>{t('label.cv_skills')}</Text>
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((sk, idx) => (
                <View
                  key={idx}
                  style={{ flexDirection: 'row', marginBottom: spacing.medium }}
                >
                  <View style={{ width: '35%' }}>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {`${t('label.cv_skill_name')}:\n${sk.skillName}`}
                    </Text>
                  </View>
                  <View style={{ flexShrink: 1, width: '70%' }}>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t('label.cv_skill_category')}: ${sk.category}`}
                    </Text>

                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t('label.cv_skill_proficiency')}: ${
                        sk.proficiencyType
                      }`}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>{t('message.cv_no_skills_info')}</Text>
            )}
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>
              {t('label.cv_certificates')}
            </Text>
            {Array.isArray(certifications) && certifications.length > 0 ? (
              certifications.map((cert, idx) => (
                <View
                  key={idx}
                  style={{ flexDirection: 'row', marginBottom: spacing.medium }}
                >
                  <View style={{ width: '35%' }}>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {cert.issueDate
                        ? formatDateForDisplay(cert.issueDate)
                        : 'Ngày cấp'}
                    </Text>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {cert.expiryDate
                        ? formatDateForDisplay(cert.expiryDate)
                        : 'Ngày hết hạn'}
                    </Text>
                  </View>
                  <View style={{ flexShrink: 1, width: '70%' }}>
                    <Text style={{ fontSize: Fonts.normal }}>
                      {`${t('label.cv_certificates')}: ${cert.name}`}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>{t('message.cv_no_certificates_info')}</Text>
            )}
          </View>
          {Array.isArray(sections) && sections.length > 0 && (
            <>
              {sections.map((sec, idx) => (
                <View key={idx} style={styles.bodyContent}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { fontWeight: 'bold', fontSize: Fonts.large },
                    ]}
                  >
                    {sec.title}
                  </Text>
                  <Text style={{ fontSize: Fonts.normal }}>{`${t(
                    'label.cv_section_description',
                  )}: ${sec.content}`}</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginHorizontal: spacing.medium,
    maxHeight: ms(800),
    padding: spacing.medium,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: Fonts.large,
    marginTop: spacing.medium,
    marginBottom: spacing.small,
    borderBottomWidth: 1,
  },
  bodyContent: {},
  footer: {},
});

export default DetailsCv;
