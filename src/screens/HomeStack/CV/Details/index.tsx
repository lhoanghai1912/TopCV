import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  AppState,
  TouchableOpacity,
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
interface Props {
  navigation: any;
  route: any;
}
const DetailsCv: React.FC<Props> = ({ route, navigation }) => {
  const cvId = route.params?.cvId;
  const [cv, setCv] = React.useState<any>(null);
  useEffect(() => {
    fetchCVDetails();
  }, []);
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
        <NavBar title={`CV Details`} onPress={() => navigation.goBack()} />
        <Text>Đang tải dữ liệu...</Text>
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
    certificate = [],
    skills = [],
    sections = [],
    title,
  } = cv;

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    if (/^\d{4}-\d{2}-01$/.test(dateString)) {
      const [year, month] = dateString.split('-');
      return `${month}/${year}`;
    }
    return dateString;
  };

  return (
    <View style={styles.container}>
      <NavBar title={`CV Details`} onPress={() => navigation.goBack()} />
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
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#eee',
              }}
            />
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 8 }}>
              {name || 'Họ và tên'}
            </Text>
            <Text style={{ color: '#555', fontSize: Fonts.normal }}>
              {content || 'Vị trí ứng tuyển'}
            </Text>
            <TouchableOpacity
              onPress={() => {}}
              style={{ position: 'absolute', top: 0, right: 0 }}
            >
              <Image source={icons.edit} style={[AppStyles.icon]} />
            </TouchableOpacity>
          </View>
          <View style={[styles.bodyContent, { borderTopWidth: 0 }]}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <Text>
              Ngày sinh: {birthday ? formatDateForDisplay(birthday) : ''}
            </Text>
            <Text>Giới tính: {gender || ''}</Text>
            <Text>Số điện thoại: {phone || ''}</Text>
            <Text>Email: {email || ''}</Text>
            <Text>Website: {website || ''}</Text>
            <Text>Địa chỉ: {address || ''}</Text>
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>Học vấn</Text>
            {Array.isArray(educations) && educations.length > 0 ? (
              educations.map((edu, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    {edu.institutionName || 'Tên trường/học viện'}
                  </Text>
                  <Text>
                    {edu.fieldOfStudy || 'Ngành học'} -{' '}
                    {edu.degree || 'Bằng cấp'}
                  </Text>
                  <Text>
                    {edu.startDate && edu.endDate
                      ? `${formatDateForDisplay(
                          edu.startDate,
                        )} - ${formatDateForDisplay(edu.endDate)}`
                      : ''}
                  </Text>
                  <Text>{edu.description || ''}</Text>
                </View>
              ))
            ) : (
              <Text>Chưa có thông tin học vấn</Text>
            )}
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>Kinh nghiệm làm việc</Text>
            {Array.isArray(experiences) && experiences.length > 0 ? (
              experiences.map((exp, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    {exp.companyName || 'Tên công ty'}
                  </Text>
                  <Text>
                    {exp.jobTitle || 'Chức danh'} -{' '}
                    {exp.startDate && exp.endDate
                      ? `${formatDateForDisplay(
                          exp.startDate,
                        )} - ${formatDateForDisplay(exp.endDate)}`
                      : ''}
                  </Text>
                  <Text>{exp.description || ''}</Text>
                </View>
              ))
            ) : (
              <Text>Chưa có kinh nghiệm làm việc</Text>
            )}
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>Kỹ năng</Text>
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((skill, idx) => (
                <Text key={idx}>
                  - {skill.skillName} ({skill.proficiencyType || ''})
                  {skill.category ? ` - ${skill.category}` : ''}
                </Text>
              ))
            ) : (
              <Text>Chưa có kỹ năng</Text>
            )}
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>Chứng chỉ</Text>
            {Array.isArray(certificate) && certificate.length > 0 ? (
              certificate.map((cert, idx) => <Text key={idx}>- {cert}</Text>)
            ) : (
              <Text>Chưa có chứng chỉ</Text>
            )}
          </View>
          {Array.isArray(sections) && sections.length > 0 && (
            <>
              {sections.map((sec, idx) => (
                <View key={idx} style={styles.bodyContent}>
                  <Text style={[styles.sectionTitle, { fontWeight: 'bold' }]}>
                    {sec.title || 'Tiêu đề'}
                  </Text>
                  <Text>{sec.content || ''}</Text>
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
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: Fonts.large,
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  bodyContent: {
    paddingBottom: spacing.medium,
    borderTopWidth: 1,
  },
  footer: {},
});

export default DetailsCv;
