import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
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
import AppStyles from '../../../../components/AppStyle';
import icons from '../../../../assets/icons';
import { ms, spacing } from '../../../../utils/spacing';
import { colors } from '../../../../utils/color';
import images from '../../../../assets/images';
import { link } from '../../../../utils/constants';
import { Fonts } from '../../../../utils/fontSize';
import AppButton from '../../../../components/AppButton';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { useCVData } from './useCVData';
import { createCV } from '../../../../services/cv';
import { updateCV } from '../../../../services/cv';
import { formatDateForDisplay } from '../../../../utils/formatDateForDisplay';
import { useSelector } from 'react-redux';
import NavBar from '../../../../components/Navbar';
import { useTranslation } from 'react-i18next';

interface Props {
  navigation: any;
  route: any;
}
// Helper function để format date cho hiển thị (yyyy-mm-dd -> dd/mm/yyyy)

// Helper function để tạo UUID giả lập cho photo path
const generatePhotoPath = () => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    },
  );
  return `/uploads/cv/photo-card/${uuid}.jpg`;
};

const CreateCV: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { token } = useSelector((state: any) => state.user);
  const [avatarUri, setAvatarUri] = useState<string>('');
  const insets = useSafeAreaInsets();

  // Sử dụng hook quản lý data CV
  const {
    title,
    setTitle,
    photoCard,
    setPhotoCard,
    name,
    setName,
    content,
    setContent,
    birthday,
    setBirthday,
    gender,
    setGender,
    phone,
    setPhone,
    email,
    setEmail,
    website,
    setWebsite,
    address,
    setAddress,
    educations,
    setEducation,
    experience: experiences,
    setExperience,
    certificate,
    setCertificate,
    skills,
    setSkill,
    sections,
    setSections,
    updateSection,
    removeSection,
    getCVData,
  } = useCVData();

  // Fill dữ liệu từ cv param nếu có
  useEffect(() => {
    console.log('DEBUG route:', route);

    const paramsCV = route?.params?.cv;
    console.log('DEBUG paramsCV:', paramsCV);
    if (paramsCV) {
      if (paramsCV.title) setTitle(paramsCV.title);
      if (paramsCV.photoCard) setPhotoCard(paramsCV.photoCard);
      if (paramsCV.name) setName(paramsCV.name);
      if (paramsCV.content) setContent(paramsCV.content);
      if (paramsCV.birthday) setBirthday(paramsCV.birthday);
      if (paramsCV.gender) setGender(paramsCV.gender);
      if (paramsCV.phone) setPhone(paramsCV.phone);
      if (paramsCV.email) setEmail(paramsCV.email);
      if (paramsCV.website) setWebsite(paramsCV.website);
      if (paramsCV.address) setAddress(paramsCV.address);
      if (Array.isArray(paramsCV.educations)) setEducation(paramsCV.educations);
      if (Array.isArray(paramsCV.experiences))
        setExperience(paramsCV.experiences);
      if (Array.isArray(paramsCV.certificate))
        setCertificate(paramsCV.certificate);
      if (Array.isArray(paramsCV.skills)) setSkill(paramsCV.skills);
      if (Array.isArray(paramsCV.sections)) setSections(paramsCV.sections);
    }
  }, [route]);

  // Log ra getCVData mỗi lần thay đổi thông tin
  useEffect(() => {
    const cvData = getCVData();
    console.log('=== LOG getCVData (auto) ===');
    console.log(JSON.stringify(cvData, null, 2));
  }, [
    title,
    photoCard,
    name,
    content,
    birthday,
    gender,
    phone,
    email,
    website,
    address,
    educations,
    experiences,
    certificate,
    skills,
    sections,
  ]);

  // Hàm điều hướng đến EditCVScreen
  const goToEditCV = (sectionKey, sectionTitle, fields) => {
    let currentData: any = null;
    switch (sectionKey) {
      case 'userProfile':
        currentData = {
          birthday,
          gender,
          phone,
          email,
          website,
          address,
        };
        break;
      case 'educations':
        currentData = educations;
        break;
      case 'experiences':
        currentData = experiences;
        break;
      case 'certificate':
        currentData = certificate;
        break;
      case 'skills':
        currentData = skills;
        break;
      case 'card':
        currentData = {
          name,
          content,
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
        console.log('Updated section:', sectionKey, 'with data:', data);
      },
    });
  };

  const handleEditField = (sectionKey, sectionTitle, fields) => {
    // Map UI keys to state keys for core fields only
    const keyMap = {
      educations: 'educations',
      skills: 'skills',
      experiences: 'experiences',
      certificate: 'certificate',
      card: 'card',
      userProfile: 'userProfile',
    };
    const stateKey = keyMap[sectionKey] || sectionKey;
    goToEditCV(stateKey, sectionTitle, fields);
  };

  const handleAddCustomSection = () => {
    navigate(Screen_Name.EditCV_Screen, {
      title: `${t('button.add_section')}`,
      fields: [
        {
          key: 'title',
          label: `${t('label.cv_section_title')}`,
          placeholder: `${t('label.cv_section_title')}`,
          keyboard: 'default',
        },
        {
          key: 'content',
          label: `${t('label.cv_section_description')}`,
          placeholder: `${t('label.cv_section_description')}`,
          keyboard: 'default',
        },
      ],
      initialData: null,
      sectionKey: 'sections', // Đánh dấu đây là custom section
      onSave: data => {
        // Tạo custom section object với unique sectionType
        const timestamp = Date.now();
        const baseType =
          data.title?.toLowerCase().replace(/\s+/g, '') || 'custom';
        const customSection = {
          sectionType: `${baseType}_${timestamp}`, // Thêm timestamp để unique
          title: data.title || 'Trường tùy chỉnh',
          content: data.content || '',
          isVisible: true,
        };
        console.log('Đang thêm custom section:', customSection);
        updateSection('sections', customSection);

        // Log CV data sau khi thêm
        setTimeout(() => {
          const cvData = getCVData();
          console.log(
            'CV đã tạo sau khi thêm custom section:',
            JSON.stringify(cvData, null, 2),
          );
        }, 100);
      },
    });
  };

  return (
    <View style={[styles.container]}>
      {token ? (
        <>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            {/* Header */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: spacing.medium,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ position: 'absolute', left: 0 }}
              >
                <Image source={icons.back} style={AppStyles.icon} />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <TextInput
                  style={[
                    {
                      paddingLeft: ms(40),
                      fontSize: Fonts.xxlarge,
                      color: colors.black,
                      fontWeight: '500',
                      textAlign: 'center',
                    },
                  ]}
                  placeholder={t('label.cv_enter_title')}
                  onChangeText={text => setTitle(text)}
                  value={title}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity>
                <Image source={icons.edit} style={AppStyles.icon} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.contentWrap}>
              <View style={styles.headerContent}>
                {/* Avatar */}
                <TouchableOpacity
                  onPress={async () => {
                    const result = await launchImageLibrary({
                      mediaType: 'photo',
                    });
                    if (result.assets && result.assets.length > 0) {
                      const uri = result.assets[0].uri;
                      if (typeof uri === 'string') {
                        setAvatarUri(uri);

                        // Tạo đường dẫn ảnh giả lập (như sau khi upload lên API)
                        const simulatedPhotoPath = generatePhotoPath();
                        console.log(
                          'Đường dẫn ảnh sau khi upload:',
                          simulatedPhotoPath,
                        );

                        // Lưu đường dẫn ảnh vào photoCard của CVData
                        setPhotoCard(simulatedPhotoPath);

                        // Hiển thị toast thông báo
                        Toast.show({
                          type: 'success',
                          text2: t('message.cv_upload_photo'),
                          visibilityTime: 3000,
                        });

                        // Log CVData sau khi cập nhật ảnh
                        setTimeout(() => {
                          const cvData = getCVData();
                          console.log('=== CV Data sau khi cập nhật ảnh ===');
                          console.log('PhotoCard:', cvData.photoCard);
                          console.log('=== CV Data hoàn chỉnh ===');
                          console.log(JSON.stringify(cvData, null, 2));
                        }, 100);
                      }
                    }
                  }}
                >
                  <Image
                    source={
                      avatarUri
                        ? { uri: avatarUri }
                        : photoCard
                        ? { uri: `${link.url}${photoCard}` }
                        : images.avt_default
                    }
                    style={styles.avtImage}
                  />
                </TouchableOpacity>
                {/* UserName + position */}
                <View>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() =>
                      handleEditField('card', 'Card', [
                        {
                          key: 'name',
                          label: `${t('label.fullname')}`,
                          placeholder: `${t('label.fullname')}`,
                        },
                        {
                          key: 'content',
                          label: `${t('label.position')}`,
                          placeholder: `${t('label.position')}`,
                          keyboard: 'default',
                        },
                      ])
                    }
                  >
                    <Text style={[AppStyles.title, { textAlign: 'center' }]}>
                      {name || `${t('label.fullname')}`}
                    </Text>
                    <Text style={[AppStyles.text, { textAlign: 'center' }]}>
                      {content || `${t('label.position')}`}
                    </Text>
                  </TouchableOpacity>

                  {/* Info */}
                </View>
              </View>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>{t(`label.info`)}</Text>
              </View>
              <TouchableOpacity
                style={styles.userInfo}
                onPress={() =>
                  handleEditField('userProfile', 'Thông tin cá nhân', [
                    {
                      key: 'birthday',
                      label: `${t('label.cv_dob')}`,
                      placeholder: `${t('label.cv_dob')}`,
                    },
                    {
                      key: 'gender',
                      label: `${t('label.cv_gender')}`,
                      placeholder: `${t('label.cv_gender')}`,
                    },
                    {
                      key: 'phone',
                      label: `${t('label.cv_phone')}`,
                      placeholder: `${t('label.cv_phone')}`,
                      keyboard: 'phone-pad',
                    },
                    {
                      key: 'email',
                      label: `${t('label.cv_email')}`,
                      placeholder: `${t('label.cv_email')}`,
                    },
                    {
                      key: 'website',
                      label: `${t('label.cv_website')}`,
                      placeholder: `${t('label.cv_website')}`,
                      keyboard: 'email-address',
                    },
                    {
                      key: 'address',
                      label: `${t('label.cv_address')}`,
                      placeholder: `${t('label.cv_address')}`,
                    },
                  ])
                }
              >
                <Text style={{ fontSize: Fonts.normal }}>
                  {`${t('label.cv_dob')}`}:{' '}
                  {birthday ? formatDateForDisplay(birthday) : ''}
                </Text>
                <Text style={{ fontSize: Fonts.normal }}>
                  {`${t('label.cv_gender')}`}: {gender || ''}
                </Text>
                <Text style={{ fontSize: Fonts.normal }}>
                  {`${t('label.cv_phone')}`}: {phone || ''}
                </Text>
                <Text style={{ fontSize: Fonts.normal }}>
                  {`${t('label.cv_email')}`}: {email || ''}
                </Text>
                <Text style={{ fontSize: Fonts.normal }}>
                  {`${t('label.cv_website')}`}: {website || ''}
                </Text>
                <Text style={{ fontSize: Fonts.normal }}>
                  {`${t('label.cv_address')}`}: {address || ''}
                </Text>
              </TouchableOpacity>
              <View style={styles.bodyContent}>
                {/* Education */}
                <TouchableOpacity
                  style={styles.bodyContentItem}
                  onPress={() =>
                    handleEditField(
                      'educations',
                      `${t('label.cv_education')}`,
                      [
                        {
                          key: 'institutionName',
                          label: `${t('label.cv_institution')}`,
                          placeholder: `${t('label.cv_institution')}`,
                        },
                        {
                          key: 'degree',
                          label: `${t('label.cv_degree')}`,
                          placeholder: `${t('label.cv_degree')}`,
                        },
                        {
                          key: 'fieldOfStudy',
                          label: `${t('label.cv_field_of_study')}`,
                          placeholder: `${t('label.cv_field_of_study')}`,
                        },
                        {
                          key: 'startDate',
                          label: `${t('label.cv_start_date')}`,
                          placeholder: `${t('label.cv_start_date')}`,
                        },
                        {
                          key: 'endDate',
                          label: `${t('label.cv_end_date')}`,
                          placeholder: `${t('label.cv_end_date')}`,
                        },
                        {
                          key: 'description',
                          label: `${t('label.cv_edu_description')}`,
                          placeholder: `${t('label.cv_edu_description')}`,
                        },
                      ],
                    )
                  }
                >
                  <View style={styles.title_underLine}>
                    <Text style={styles.title}>{t(`label.cv_education`)}</Text>
                  </View>
                  {/* Education */}
                  {Array.isArray(educations) && educations.length > 0 ? (
                    educations.map((edu, idx) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: spacing.medium,
                        }}
                        key={idx}
                      >
                        <View style={{ width: '35%' }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: Fonts.normal,
                            }}
                          >
                            {edu.startDate && edu.endDate
                              ? `${formatDateForDisplay(
                                  edu.startDate,
                                )} - ${formatDateForDisplay(edu.endDate)}`
                              : `${t('label.cv_start_date')} - ${t(
                                  'label.cv_end_date',
                                )}`}
                          </Text>
                        </View>
                        <View style={{ flexShrink: 1, width: '70%' }}>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_institution')}:{' '}
                            <Text style={{}}>{edu.institutionName}</Text>
                          </Text>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_field_of_study')}:{' '}
                            <Text style={{}}>{edu.fieldOfStudy}</Text>
                          </Text>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_degree')}:{' '}
                            <Text style={{}}>{edu.degree}</Text>
                          </Text>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_edu_description')}:{' '}
                            <Text style={{}}>{edu.description}</Text>
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={{ width: '100%' }}>
                      <Text style={{ fontSize: Fonts.normal }}>
                        {`${t('label.cv_start_date')} - ${t(
                          'label.cv_end_date',
                        )}`}
                      </Text>
                      <Text style={{ fontSize: Fonts.normal }}>
                        {`${t('label.cv_institution')}`}
                      </Text>
                      <Text style={{ fontSize: Fonts.normal }}>{`${t(
                        'label.cv_field_of_study',
                      )}`}</Text>
                      <Text style={{ fontSize: Fonts.normal }}>
                        {`${t('label.cv_edu_description')}`}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {/* Experience */}
                <TouchableOpacity
                  style={styles.bodyContentItem}
                  onPress={() =>
                    handleEditField(
                      'experiences',
                      `${t('label.cv_experience')}`,
                      [
                        {
                          key: 'jobTitle',
                          label: `${t('label.cv_job_title')}`,
                          placeholder: `${t('label.cv_job_title')}`,
                        },
                        {
                          key: 'companyName',
                          label: `${t('label.cv_company')}`,
                          placeholder: `${t('label.cv_company')}`,
                        },
                        {
                          key: 'startDate',
                          label: `${t('label.cv_start_date')}`,
                          placeholder: 'YYYY-MM-DD',
                        },
                        {
                          key: 'endDate',
                          label: `${t('label.cv_end_date')}`,
                          placeholder: 'YYYY-MM-DD',
                        },
                        {
                          key: 'description',
                          label: `${t('label.cv_job_description')}`,
                          placeholder: `${t('label.cv_job_description')}`,
                        },
                      ],
                    )
                  }
                >
                  <View style={styles.title_underLine}>
                    <Text style={styles.title}>{t(`label.cv_experience`)}</Text>
                  </View>
                  {/* Experience */}
                  {Array.isArray(experiences) && experiences.length > 0 ? (
                    experiences.map((exp, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          marginBottom: spacing.medium,
                        }}
                      >
                        <View style={{ width: '35%' }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: Fonts.normal,
                            }}
                          >
                            {exp.startDate && exp.endDate
                              ? `${formatDateForDisplay(
                                  exp.startDate,
                                )} - ${formatDateForDisplay(exp.endDate)}`
                              : `${t('label.cv_issue_date')} - ${t(
                                  'label.cv_expiry_date',
                                )}`}
                          </Text>
                        </View>
                        <View style={{ flexShrink: 1, width: '70%' }}>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_company')}:{' '}
                            <Text style={{}}>{exp.companyName}</Text>
                          </Text>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_job_title')}:{' '}
                            <Text style={{}}>{exp.jobTitle}</Text>
                          </Text>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_job_description')}:{' '}
                            <Text style={{}}>{exp.description}</Text>
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={{ width: '100%' }}>
                      <Text style={{ fontSize: Fonts.normal }}>
                        {`${t('label.cv_issue_date')} - ${t(
                          'label.cv_expiry_date',
                        )}`}
                      </Text>
                      <Text style={{ fontSize: Fonts.normal }}>
                        {`${t('label.cv_company')}`}
                      </Text>
                      <Text style={{ fontSize: Fonts.normal }}>{`${t(
                        'label.cv_job_title',
                      )}`}</Text>
                      <Text style={{ fontSize: Fonts.normal }}>
                        {`${t('label.cv_job_description')}`}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Certificate */}
                {/* Certificate */}
                <TouchableOpacity
                  style={styles.bodyContentItem}
                  onPress={() =>
                    handleEditField(
                      'certificate',
                      `${t('label.cv_certificates')}`,
                      [
                        {
                          key: 'name',
                          label: `${t('label.cv_certificate_name')}`,
                          placeholder: `${t('label.cv_certificate_name')}`,
                        },
                        {
                          key: 'issueDate',
                          label: `${t('label.cv_issue_date')}`,
                          placeholder: 'YYYY-MM-DD',
                        },
                        {
                          key: 'expiryDate',
                          label: `${t('label.cv_expiry_date')}`,
                          placeholder: 'YYYY-MM-DD ',
                        },
                      ],
                    )
                  }
                >
                  <View style={styles.title_underLine}>
                    <Text style={styles.title}>
                      {t(`label.cv_certificates`)}
                    </Text>
                  </View>
                  {Array.isArray(certificate) ? (
                    certificate.length > 0 ? (
                      certificate.map((cert, idx) => (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            marginBottom: spacing.medium,
                          }}
                        >
                          <View style={{ width: '35%' }}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: Fonts.normal,
                              }}
                            >
                              {cert.issueDate
                                ? formatDateForDisplay(cert.issueDate)
                                : ''}
                            </Text>
                            <Text style={{ fontSize: Fonts.normal }}>
                              <Text style={{}}>
                                {cert.expiryDate
                                  ? formatDateForDisplay(cert.expiryDate)
                                  : ''}
                              </Text>
                            </Text>
                          </View>
                          <View style={{ flexShrink: 1, width: '70%' }}>
                            <Text style={{ fontSize: Fonts.normal }}>
                              {t('label.cv_certificates')}:{' '}
                              <Text style={{}}>{cert.name || ''}</Text>
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: Fonts.normal }}>
                          {`${t('label.cv_certificate_name')}`}
                        </Text>
                        <Text style={{ fontSize: Fonts.normal }}>
                          {`${t('label.cv_issue_date')} - ${t(
                            'label.cv_expiry_date',
                          )}`}
                        </Text>
                      </View>
                    )
                  ) : (
                    <View style={{ width: '100%' }}>
                      <Text style={{ fontSize: Fonts.normal }}>{`${t(
                        'label.cv_issue_date',
                      )} - ${t('label.cv_expiry_date')}`}</Text>
                      <Text style={{ fontSize: Fonts.normal }}>{`${t(
                        'label.cv_certificate_name',
                      )}`}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {/* Skill */}
                <TouchableOpacity
                  style={styles.bodyContentItem}
                  onPress={() =>
                    handleEditField('skills', `${t('label.cv_skills')}`, [
                      {
                        key: 'skillName',
                        label: `${t('label.cv_skill_name')}`,
                        placeholder: `${t('label.cv_skill_name')}`,
                      },
                      {
                        key: 'category',
                        label: `${t('label.cv_skill_category')}`,
                        placeholder: `${t('label.cv_skill_category')}`,
                      },

                      {
                        key: 'proficiencyType',
                        label: `${t('label.cv_skill_proficiency')}`,
                        placeholder: `${t('label.cv_skill_proficiency')}`,
                      },
                    ])
                  }
                >
                  <View style={styles.title_underLine}>
                    <Text style={styles.title}>{t(`label.cv_skills`)}</Text>
                  </View>
                  {/* Skill */}
                  {Array.isArray(skills) && skills.length > 0 ? (
                    skills.map((sk, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          marginBottom: spacing.medium,
                        }}
                      >
                        <View style={{ width: '35%' }}>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {`${t('label.cv_skill_name')}:\n${sk.skillName}`}
                          </Text>
                        </View>
                        <View style={{ flexShrink: 1, width: '70%' }}>
                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_skill_category')}:{' '}
                            <Text>{sk.category}</Text>
                          </Text>

                          <Text style={{ fontSize: Fonts.normal }}>
                            {t('label.cv_skill_proficiency')}:{' '}
                            <Text>{sk.proficiencyType}</Text>
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={{ width: '100%' }}>
                      <Text style={{ fontSize: Fonts.normal }}>
                        {`${t('label.cv_skill_name')}`}
                      </Text>
                      <Text style={{ fontSize: Fonts.normal }}>{`${t(
                        'label.cv_skill_description',
                      )}`}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Custom Sections */}
              {Array.isArray(sections) &&
                sections.length > 0 &&
                sections.map((section, index) => (
                  <View key={index} style={styles.bodyContentItem}>
                    <TouchableOpacity
                      style={styles.bodyContentItem}
                      onPress={() => {
                        navigate(Screen_Name.EditCV_Screen, {
                          title: section.title,
                          fields: [
                            {
                              key: 'title',
                              label: `${t('label.cv_section_title')}`,
                              placeholder: `${t('label.cv_section_title')}`,
                            },
                            {
                              key: 'content',
                              label: `${t('label.cv_section_description')}`,
                              placeholder: `${t(
                                'label.cv_section_description',
                              )}`,
                            },
                          ],
                          initialData: {
                            title: section.title,
                            content: section.content,
                          },
                          sectionKey: 'sections',
                          onSave: data => {
                            const updatedSection = {
                              sectionType: section.sectionType,
                              title: data.title || section.title,
                              content: data.content || '',
                              isVisible: true,
                            };
                            console.log(
                              'Đang cập nhật custom section:',
                              updatedSection,
                            );
                            updateSection('sections', updatedSection);

                            // Log CV data sau khi cập nhật
                            setTimeout(() => {
                              const cvData = getCVData();
                              console.log(
                                'CV sau khi cập nhật custom section:',
                                JSON.stringify(cvData, null, 2),
                              );
                            }, 100);
                          },
                        });
                      }}
                    >
                      <View style={styles.title_underLine}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={styles.title}>{section.title}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              // Xóa section bằng sectionType
                              if (section.sectionType) {
                                removeSection(section.sectionType);
                                console.log('Đã xóa custom section:', section);
                              }
                            }}
                            style={{ padding: 5 }}
                          >
                            <Text style={{ color: 'red', fontSize: 18 }}>
                              🗑️
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: Fonts.normal }}>
                          {`${t('label.cv_section_description')}: ${
                            section.content
                          }`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}

              {/* Custom Section Button */}
              <TouchableOpacity
                style={styles.addCustomSectionButton}
                onPress={() => handleAddCustomSection()}
              >
                <Text style={styles.addCustomSectionText}>
                  {`${t('button.add_section')}`}
                </Text>
              </TouchableOpacity>
            </View>

            <AppButton
              title={
                route?.params?.cv
                  ? `${t('button.updateCV')}`
                  : `${t('button.createCV')}`
              }
              onPress={async () => {
                try {
                  const cvData = getCVData();
                  const imageUri = avatarUri;
                  if (route?.params?.cv && route?.params?.cv.id) {
                    // Nếu có dữ liệu CV truyền sang, gọi updateCV

                    const result = await updateCV(
                      route.params.cv.id,
                      cvData,
                      imageUri,
                    );
                    Toast.show({
                      type: 'success',
                      text2: `${t('message.update_success')} `,

                      visibilityTime: 3000,
                    });
                    navigate(Screen_Name.CV_Screen, { refresh: true });
                  } else {
                    // Nếu không có dữ liệu truyền sang, gọi createCV

                    const result = await createCV(cvData, imageUri);
                    Toast.show({
                      type: 'success',
                      text2: t('message.create_success'),
                      visibilityTime: 3000,
                    });
                    console.log('=== KẾT QUẢ TẠO CV ===');
                    console.log('API Response:', result);
                  }
                } catch (error) {}
              }}
              customStyle={{ marginBottom: spacing.large }}
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}></View>
        </>
      ) : (
        <View style={{ padding: spacing.medium, flex: 1 }}>
          <NavBar
            title={t('label.cv_create')}
            onPress={() => navigation.goBack()}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Text
              style={[
                AppStyles.title,
                { marginTop: spacing.medium, textAlign: 'center' },
              ]}
            >
              {t('label.cv_login')}
            </Text>
          </View>
        </View>
      )}
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
    paddingHorizontal: spacing.medium,
  },

  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.medium,
  },
  content: {
    marginHorizontal: spacing.medium,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.medium,
    borderWidth: 1,
    borderRadius: 15,
    maxHeight: ms(800),
  },
  contentWrap: { padding: spacing.small },
  headerContent: {
    marginBottom: spacing.large,
    alignItems: 'center',
  },
  avtImage: {
    width: ms(150),
    height: ms(150),
    borderRadius: 100,
    marginTop: spacing.small,
    resizeMode: 'cover',
  },
  card: { marginTop: spacing.small },

  userInfo: { marginBottom: spacing.medium },
  bodyContent: {},
  bodyContentItem: { marginBottom: spacing.medium },
  footer: {},
  title: { fontSize: Fonts.large, fontWeight: 'bold' },
  title_underLine: {
    borderBottomWidth: 1,
    flex: 1,
    marginBottom: spacing.medium,
  },
  addCustomSectionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderRadius: 8,
    marginVertical: spacing.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addCustomSectionText: {
    color: colors.white,
    fontSize: Fonts.normal,
    fontWeight: 'bold',
  },
});

export default CreateCV;
