import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getCVDetail } from '../../../../services/cv';
import NavBar from '../../../../components/Navbar';
import { link } from '../../../../utils/constants';
import images from '../../../../assets/images';
import { ms, spacing } from '../../../../utils/spacing';
import { ScrollView } from 'react-native-gesture-handler';
import icons from '../../../../assets/icons';
import { Screen_Name } from '../../../../navigation/ScreenName';

interface Props {
  navigation: any;
  route: any;
}

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

const DetailsCv: React.FC<Props> = ({ route, navigation }) => {
  const cvId = route.params?.cvId;
  const [cv, setCv] = useState<any>(null);
  useEffect(() => {
    const fetchCVDetails = async () => {
      try {
        const res = await getCVDetail(cvId);
        setCv(res.data);
      } catch (error) {}
    };
    fetchCVDetails();
  }, [cvId]);

  if (!cv) {
    return (
      <View style={styles.container}>
        <NavBar title="Chi tiết CV" onPress={() => navigation.goBack()} />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const {
    photoCard,
    name,
    content,
    educations = [],
    experiences = [],
    skills = [],
    certificate = [],
    sections = [],
  } = cv;

  return (
    <View style={styles.container}>
      <NavBar title="Chi tiết CV" onPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.body}>
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
            <Text style={{ color: '#555', fontSize: 16 }}>
              {content || 'Vị trí ứng tuyển'}
            </Text>
            <TouchableOpacity
              style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
              onPress={() =>
                navigation.navigate(Screen_Name.CreateCV_Screen, { cv })
              }
            >
              <Image source={icons.edit} style={{ width: 32, height: 32 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.bodyContent}>
            <Text style={styles.sectionTitle}>Học vấn</Text>
            {Array.isArray(educations) && educations.length > 0 ? (
              educations.map((edu: any, idx: number) => (
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
              experiences.map((exp: any, idx: number) => (
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
              skills.map((skill: any, idx: number) => (
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
              certificate.map((cert: any, idx: number) => (
                <Text key={idx}>- {cert}</Text>
              ))
            ) : (
              <Text>Chưa có chứng chỉ</Text>
            )}
          </View>
          {Array.isArray(sections) && sections.length > 0 && (
            <View style={styles.bodyContent}>
              {sections.map((sec: any, idx: number) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={[styles.sectionTitle, { fontWeight: 'bold' }]}>
                    {sec.title || 'Tiêu đề'}
                  </Text>
                  <Text>{sec.content || ''}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    fontSize: 18,
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
// ...existing code ends here. All content after this line is removed.
