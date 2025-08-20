import React, { useCallback, useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles from '../../../components/AppStyle';
import icons from '../../../assets/icons';
import { ms, spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';
import images from '../../../assets/images';
import { Fonts } from '../../../utils/fontSize';
import AppButton from '../../../components/AppButton';
import { uploadUserAvatar } from '../../../services/user';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { useCVData } from './useCVData';
import moment from 'moment';

const CreateCVScreen: React.FC = navigation => {
  const [avatarUri, setAvatarUri] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const insets = useSafeAreaInsets();

  const [title, setTitle] = React.useState('');
  const [photoCard, setPhotoCard] = useState('');

  // Sử dụng hook quản lý data CV
  const {
    name,
    position,
    birthday,
    gender,
    phone,
    email,
    website,
    address,
    education,
    experience,
    certificate,
    skill,
    updateSection,
    getCVData,
  } = useCVData();

  // Hàm điều hướng đến EditCVScreen
  const goToEditCV = (sectionKey, sectionTitle, fields) => {
    let currentData: any = null;
    switch (sectionKey) {
      case 'userProfile':
        currentData = {
          name,
          position,
          birthday,
          gender,
          phone,
          email,
          website,
          address,
        };
        break;
      case 'education':
        currentData = education;
        break;
      case 'experience':
        currentData = experience;
        break;
      case 'certificate':
        currentData = certificate;
        break;
      case 'skill':
        currentData = skill;
        break;
      case 'card':
        currentData = {
          name,
          position,
        };
        break;
      default:
        break;
    }
    navigate(Screen_Name.EditCV_Screen, {
      title: sectionTitle,
      fields,
      initialData: currentData,
      onSave: data => {
        updateSection(sectionKey, data);
      },
    });
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    // MM/YY hoặc MM-YY => YYYY-MM-DD (năm 20YY, ngày 01)
    if (/^\d{2}[-/]\d{2}$/.test(date)) {
      const [month, year] = date.split(/[-\/]/);
      const fullYear = year.length === 2 ? `20${year}` : year;
      return moment(`${fullYear}-${month}-01`, 'YYYY-MM-DD').format(
        'YYYY-MM-DD',
      );
    }
    // yyyy-mm hoặc yyyy/mm => yyyy-mm-01
    if (/^\d{4}[-/]\d{2}$/.test(date)) {
      const [year, month] = date.split(/[-\/]/);
      return moment(`${year}-${month}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }
    // yyyy => yyyy-01-01
    if (/^\d{4}$/.test(date)) {
      return moment(`${date}-01-01`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }
    // Các format còn lại
    return moment(date, [
      'YYYY-MM-DD',
      'DD/MM/YYYY',
      'DD-MM-YYYY',
      'MM/YYYY',
      'MM-YYYY',
    ]).format('YYYY-MM-DD');
  };

  // Khi tạo dữ liệu gửi lên API:
  const cvDataToSend = {
    name,
    birthday: formatDate(birthday || ''),
    gender,
    phoneNumber: phone || '',
    address,
    title,
    templateId: 2,
    content: position || '',
    isPublic: true,
    photoCard,
    sections: [], // TODO: lấy từ state sections nếu có
    skill: Array.isArray(skill)
      ? skill.map(sk => ({
          skillName: sk.skillName || '',
          category: sk.category || '',
          proficiencyLevel: sk.proficiencyLevel || 0,
          proficiencyType: sk.proficiencyType || '',
        }))
      : [],
    experience: Array.isArray(experience)
      ? experience.map(exp => ({
          jobTitle: exp.jobTitle || '',
          companyName: exp.companyName || '',
          startDate: formatDate(exp.startDate || ''),
          endDate: formatDate(exp.endDate || ''),
          description: exp.description || '',
        }))
      : [],
    education: Array.isArray(education)
      ? education.map(ed => ({
          institutionName: ed.institutionName || '',
          degree: ed.degree || '',
          fieldOfStudy: ed.fieldOfStudy || '',
          startDate: formatDate(ed.startDate || ''),
          endDate: formatDate(ed.endDate || ''),
          description: ed.description || '',
        }))
      : [],
    certification: Array.isArray(certificate)
      ? certificate.map(cert => ({
          name: cert.name || '',
          issueDate: formatDate(cert.issueDate || ''),
          expiryDate: cert.expiryDate ? formatDate(cert.expiryDate) : null,
        }))
      : [],
    languages: [], // TODO: lấy từ state languages nếu có
  };

  const handleEditField = (sectionKey, sectionTitle, fields) => {
    // Map UI keys to state keys for core fields only
    const keyMap = {
      education: 'education',
      skill: 'skill',
      experience: 'experience',
      certification: 'certification',
      card: 'card',
      userProfile: 'userProfile',
    };
    const stateKey = keyMap[sectionKey] || sectionKey;
    goToEditCV(stateKey, sectionTitle, fields);
  };

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTitleContainer}>
          <TextInput
            style={[AppStyles.title, { paddingLeft: ms(40) }]}
            placeholder="Enter CV Title"
            onChangeText={text => setTitle(text)}
            value={title}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity>
          <Image source={icons.edit} style={AppStyles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.contentWrap}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={async () => {
                const result = await launchImageLibrary({ mediaType: 'photo' });
                if (result.assets && result.assets.length > 0) {
                  const uri = result.assets[0].uri;
                  if (typeof uri === 'string') {
                    setAvatarUri(uri);
                  }
                }
              }}
            >
              <Image
                source={avatarUri ? { uri: avatarUri } : images.avt}
                style={styles.avtImage}
              />
            </TouchableOpacity>
            <View style={styles.info}>
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  handleEditField('card', 'Card', [
                    { key: 'name', label: 'Tên', placeholder: 'Nhập tên' },
                    {
                      key: 'position',
                      label: 'Vị trí ứng tuyển',
                      placeholder: 'Nhập vị trí ứng tuyển',
                    },
                  ])
                }
              >
                <Text style={AppStyles.title}>{name || 'Họ và tên'}</Text>
                <Text style={AppStyles.text}>
                  {position || 'Vị trí ứng tuyển'}
                </Text>
              </TouchableOpacity>

              {/* Info */}
              <TouchableOpacity
                style={styles.userInfo}
                onPress={() =>
                  handleEditField('userProfile', 'Thông tin cá nhân', [
                    {
                      key: 'birthday',
                      label: 'Ngày sinh',
                      placeholder: 'Nhập ngày sinh',
                    },
                    {
                      key: 'gender',
                      label: 'Giới tính',
                      placeholder: 'Nhập giới tính',
                    },
                    {
                      key: 'phone',
                      label: 'Số điện thoại',
                      placeholder: 'Nhập số điện thoại',
                    },
                    { key: 'email', label: 'Email', placeholder: 'Nhập email' },
                    {
                      key: 'website',
                      label: 'Website',
                      placeholder: 'Nhập website',
                    },
                    {
                      key: 'address',
                      label: 'Địa chỉ',
                      placeholder: 'Nhập địa chỉ',
                    },
                  ])
                }
              >
                <Text>Ngày sinh: {birthday || ''}</Text>
                <Text>Giới tính: {gender || ''}</Text>
                <Text>Số điện thoại: {phone || ''}</Text>
                <Text>Email: {email || ''}</Text>
                <Text>Website: {website || ''}</Text>
                <Text>Địa chỉ: {address || ''}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bodyContent}>
            {/* Education */}
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                handleEditField('education', 'Học vấn', [
                  {
                    key: 'institutionName',
                    label: 'Tên trường/học viện',
                    placeholder: 'Nhập tên trường/học viện',
                  },
                  {
                    key: 'degree',
                    label: 'Bằng cấp',
                    placeholder: 'Nhập bằng cấp',
                  },
                  {
                    key: 'fieldOfStudy',
                    label: 'Ngành học',
                    placeholder: 'Nhập ngành học',
                  },
                  {
                    key: 'startDate',
                    label: 'Thời gian bắt đầu',
                    placeholder: 'YYYY-MM-DD',
                  },
                  {
                    key: 'endDate',
                    label: 'Thời gian kết thúc',
                    placeholder: 'YYYY-MM-DD',
                  },
                  {
                    key: 'description',
                    label: 'Thông tin thêm',
                    placeholder: 'Thành tích, điểm số...',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>HỌC VẤN</Text>
              </View>
              {/* Education */}
              {Array.isArray(education) && education.length > 0 ? (
                education.map((edu, idx) => (
                  <View
                    key={idx}
                    style={{ flexDirection: 'row', marginBottom: 16 }}
                  >
                    <View style={{ width: '35%' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                        {edu.startDate && edu.endDate
                          ? `${edu.startDate} - ${edu.endDate}`
                          : 'Bắt đầu - Kết thúc'}
                      </Text>
                    </View>
                    <View style={{ flexShrink: 1, width: '70%' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {edu.institutionName || 'Tên trường/học viện:'}
                      </Text>
                      <Text style={{ fontSize: 15 }}>
                        {edu.fieldOfStudy || 'Ngành học'}
                      </Text>
                      <Text style={{ fontSize: 15 }}>
                        {edu.degree || 'Bằng cấp'}
                      </Text>
                      <Text style={{ fontSize: 15 }}>
                        {edu.description || 'Thông tin thêm'}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ width: '100%' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    Bắt đầu - Kết thúc
                  </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    Tên trường/học viện
                  </Text>
                  <Text style={{ fontSize: 15 }}>Ngành học</Text>
                  <Text style={{ fontSize: 15 }}>
                    Mô tả quá trình học tập hoặc thành tích của bạn
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {/* Experience */}
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                handleEditField('experience', 'Kinh nghiệm làm việc', [
                  {
                    key: 'jobTitle',
                    label: 'Chức danh công việc',
                    placeholder: 'Nhập chức danh công việc',
                  },
                  {
                    key: 'companyName',
                    label: 'Tên công ty',
                    placeholder: 'Nhập tên công ty',
                  },
                  {
                    key: 'startDate',
                    label: 'Ngày bắt đầu',
                    placeholder: 'YYYY-MM-DD',
                  },
                  {
                    key: 'endDate',
                    label: 'Ngày kết thúc',
                    placeholder: 'YYYY-MM-DD',
                  },
                  {
                    key: 'description',
                    label: 'Mô tả công việc',
                    placeholder: 'Mô tả công việc, nhiệm vụ chính',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>KINH NGHIỆM LÀM VIỆC</Text>
              </View>
              {/* Experience */}
              {Array.isArray(experience) && experience.length > 0 ? (
                experience.map((exp, idx) => (
                  <View key={idx} style={{ flexDirection: 'row' }}>
                    <View style={{ width: '35%' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                        {exp.startDate && exp.endDate
                          ? `${exp.startDate} - ${exp.endDate}`
                          : 'Bắt đầu - Kết thúc'}
                      </Text>
                    </View>
                    <View style={{ flexShrink: 1, width: '70%' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {exp.companyName || 'Tên công ty:'}
                      </Text>
                      <Text style={{ fontSize: 15 }}>
                        {exp.jobTitle || 'Chức danh công việc'}
                      </Text>
                      <Text style={{ fontSize: 15 }}>
                        {exp.description || 'Mô tả công việc'}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ width: '100%' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    Bắt đầu - Kết thúc
                  </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    Tên công ty
                  </Text>
                  <Text style={{ fontSize: 15 }}>Vị trí công việc</Text>
                  <Text style={{ fontSize: 15 }}>
                    Mô tả kinh nghiệm làm việc hoặc thành tích của bạn
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Certificate */}
            {/* Certificate */}
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                handleEditField('certification', 'Chứng chỉ', [
                  {
                    key: 'name',
                    label: 'Tên chứng chỉ',
                    placeholder: 'Nhập tên chứng chỉ',
                  },
                  {
                    key: 'issueDate',
                    label: 'Ngày cấp',
                    placeholder: 'YYYY-MM-DD',
                  },
                  {
                    key: 'expiryDate',
                    label: 'Ngày hết hạn',
                    placeholder: 'YYYY-MM-DD (tùy chọn)',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>CHỨNG CHỈ</Text>
              </View>
              {Array.isArray(certificate) ? (
                certificate.length > 0 ? (
                  certificate.map((cert, idx) => (
                    <View
                      key={idx}
                      style={{ flexDirection: 'row', marginBottom: 16 }}
                    >
                      <View style={{ width: '35%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                          {cert.issueDate || 'Ngày cấp'}
                        </Text>
                      </View>
                      <View style={{ flexShrink: 1, width: '70%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                          {cert.name || 'Tên chứng chỉ'}
                        </Text>
                        <Text style={{ fontSize: 15 }}>
                          {cert.expiryDate || 'Ngày hết hạn'}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={{ width: '100%' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                      Năm
                    </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                      Tên chứng chỉ
                    </Text>
                  </View>
                )
              ) : (
                <View style={{ width: '100%' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Năm</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    Tên chứng chỉ
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {/* Skill */}
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                handleEditField('skill', 'Kỹ năng', [
                  {
                    key: 'skillName',
                    label: 'Tên kỹ năng',
                    placeholder: 'Nhập tên kỹ năng',
                  },
                  {
                    key: 'category',
                    label: 'Phân loại kỹ năng',
                    placeholder: 'Technical, Soft...',
                  },
                  {
                    key: 'proficiencyLevel',
                    label: 'Mức độ thành thạo (1-5)',
                    placeholder: '1-5',
                  },
                  {
                    key: 'proficiencyType',
                    label: 'Cơ bản / Trung bình / Nâng cao',
                    placeholder: 'Chọn mức độ',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>KỸ NĂNG</Text>
              </View>
              {/* Skill */}
              <View style={{ flexDirection: 'row' }}>
                {Array.isArray(skill) && skill.length > 0 ? (
                  skill.map((sk, idx) => (
                    <View
                      key={idx}
                      style={{ flexDirection: 'row', marginBottom: 8 }}
                    >
                      <View style={{ width: '35%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                          {sk.skillName || 'Tên kỹ năng'}
                        </Text>
                      </View>
                      <View style={{ flexShrink: 1, width: '70%' }}>
                        <Text style={{ fontSize: 15 }}>
                          {sk.category || 'Phân loại kỹ năng'}
                        </Text>
                        <Text style={{ fontSize: 15 }}>
                          {sk.proficiencyLevel
                            ? `Level: ${sk.proficiencyLevel}`
                            : 'Mức độ thành thạo'}
                        </Text>
                        <Text style={{ fontSize: 15 }}>
                          {sk.proficiencyType || 'Loại thành thạo'}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={{ width: '100%' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                      Tên kỹ năng
                    </Text>
                    <Text style={{ fontSize: 15 }}>Mô tả kỹ năng</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <AppButton
          title="Lưu CV"
          onPress={() => {
            // TODO: Implement save CV logic
          }}
          customStyle={{ marginBottom: spacing.large }}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}></View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.white,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.medium,
  },
  content: {
    flex: 1,
    marginVertical: spacing.large,
    marginHorizontal: spacing.medium,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.medium,
  },
  contentWrap: {},
  headerContent: {
    flexDirection: 'row',
    marginBottom: spacing.large,
  },
  avtImage: {
    width: ms(120),
    height: ms(160),
    marginTop: spacing.small,
    resizeMode: 'cover',
  },
  card: {},
  info: {
    flex: 1,
    marginLeft: spacing.small,
    // backgroundColor: colors.lightGray,
  },
  userInfo: {},
  bodyContent: {},
  bodyContentItem: { marginBottom: spacing.medium },
  footer: {},
  title: { fontSize: Fonts.large, fontWeight: 'bold' },
  title_underLine: {
    borderBottomWidth: 1,
    flex: 1,
    marginBottom: spacing.medium,
  },
});

export default CreateCVScreen;
