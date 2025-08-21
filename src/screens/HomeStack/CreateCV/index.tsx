import React, { useCallback, useEffect, useState } from 'react';
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
import AppStyles from '../../../components/AppStyle';
import icons from '../../../assets/icons';
import { ms, spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';
import images from '../../../assets/images';
import { Fonts } from '../../../utils/fontSize';
import AppButton from '../../../components/AppButton';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { useCVData } from './useCVData';
import { createCV } from '../../../services/cv';
import { useSelector } from 'react-redux';
import NavBar from '../../../components/Navbar';

interface Props {
  navigation: any;
}
// Helper function để format date cho hiển thị (yyyy-mm-dd -> dd/mm/yyyy)
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return '';

  // Nếu là format yyyy-mm-dd thì convert sang dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  // Nếu là format yyyy-mm-01 thì convert sang mm/yyyy
  if (/^\d{4}-\d{2}-01$/.test(dateString)) {
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
  }

  return dateString; // Trả về nguyên bản nếu không match
};

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

const CreateCVScreen: React.FC<Props> = ({ navigation }) => {
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
    content,
    birthday: birthday,
    gender,
    phone,
    email,
    website,
    address,
    educations,
    experience: experiences,
    certificate,
    skills,
    sections,
    updateSection,
    removeSection,
    getCVData,
  } = useCVData();

  // Hàm điều hướng đến EditCVScreen
  const goToEditCV = (sectionKey, sectionTitle, fields) => {
    let currentData: any = null;
    switch (sectionKey) {
      case 'userProfile':
        currentData = {
          name,
          content,
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
      title: 'Thêm trường tùy chỉnh',
      fields: [
        {
          key: 'title',
          label: 'Tiêu đề phần',
          placeholder: 'Nhập tiêu đề phần (VD: Dự án, Hoạt động...)',
          keyboard: 'default',
        },
        {
          key: 'content',
          label: 'Nội dung phần',
          placeholder: 'Nhập nội dung cho phần này',
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
  console.log('avatar', avatarUri);

  return (
    <View style={[styles.container]}>
      {token ? (
        <>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            {/* Header */}
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
                          text1: 'Ảnh đã được chọn! 📷',
                          text2: 'Đường dẫn ảnh đã được lưu vào CV',
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
                          key: 'content',
                          label: 'Vị trí ứng tuyển',
                          placeholder: 'Nhập vị trí ứng tuyển',
                          keyboard: 'default',
                        },
                      ])
                    }
                  >
                    <Text style={AppStyles.title}>{name || 'Họ và tên'}</Text>
                    <Text style={AppStyles.text}>
                      {content || 'Vị trí ứng tuyển'}
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
                          keyboard: 'phone-pad',
                        },
                        {
                          key: 'email',
                          label: 'Email',
                          placeholder: 'Nhập email',
                        },
                        {
                          key: 'website',
                          label: 'Website',
                          placeholder: 'Nhập website',
                          keyboard: 'email-address',
                        },
                        {
                          key: 'address',
                          label: 'Địa chỉ',
                          placeholder: 'Nhập địa chỉ',
                        },
                      ])
                    }
                  >
                    <Text>
                      Ngày sinh:{' '}
                      {birthday ? formatDateForDisplay(birthday) : ''}
                    </Text>
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
                    handleEditField('educations', 'Học vấn', [
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
                  {Array.isArray(educations) && educations.length > 0 ? (
                    educations.map((edu, idx) => (
                      <View
                        style={{ flexDirection: 'row', marginBottom: 16 }}
                        key={idx}
                      >
                        <View style={{ width: '35%' }}>
                          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                            {edu.startDate && edu.endDate
                              ? `${formatDateForDisplay(
                                  edu.startDate,
                                )} - ${formatDateForDisplay(edu.endDate)}`
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
                    handleEditField('experiences', 'Kinh nghiệm làm việc', [
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
                  {Array.isArray(experiences) && experiences.length > 0 ? (
                    experiences.map((exp, idx) => (
                      <View key={idx} style={{ flexDirection: 'row' }}>
                        <View style={{ width: '35%' }}>
                          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                            {exp.startDate && exp.endDate
                              ? `${formatDateForDisplay(
                                  exp.startDate,
                                )} - ${formatDateForDisplay(exp.endDate)}`
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
                    handleEditField('certificate', 'Chứng chỉ', [
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
                              {cert.issueDate
                                ? formatDateForDisplay(cert.issueDate)
                                : 'Ngày cấp'}
                            </Text>
                          </View>
                          <View style={{ flexShrink: 1, width: '70%' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                              {cert.name || 'Tên chứng chỉ'}
                            </Text>
                            <Text style={{ fontSize: 15 }}>
                              {cert.expiryDate
                                ? formatDateForDisplay(cert.expiryDate)
                                : 'Ngày hết hạn'}
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
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                        Năm
                      </Text>
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
                    handleEditField('skills', 'Kỹ năng', [
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
                        key: 'proficiencyType',
                        label: 'Mức độ thành thạo',
                        placeholder: 'Chọn mức độ',
                      },
                    ])
                  }
                >
                  <View style={styles.title_underLine}>
                    <Text style={styles.title}>KỸ NĂNG</Text>
                  </View>
                  {/* Skill */}
                  {Array.isArray(skills) && skills.length > 0 ? (
                    skills.map((sk, idx) => (
                      <View
                        key={idx}
                        style={{ flexDirection: 'row', marginBottom: 16 }}
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
                              label: 'Tiêu đề phần',
                              placeholder: 'Nhập tiêu đề phần',
                            },
                            {
                              key: 'content',
                              label: 'Nội dung phần',
                              placeholder: 'Nhập nội dung cho phần này',
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
                          <Text style={styles.title}>
                            {(
                              section.title || 'TRƯỜNG TÙY CHỈNH'
                            ).toUpperCase()}
                          </Text>
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
                        <Text style={{ fontSize: 15 }}>
                          {section.content || 'Nhấn để chỉnh sửa nội dung'}
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
                  + Thêm trường tùy chỉnh
                </Text>
              </TouchableOpacity>
            </View>

            <AppButton
              title="Lưu CV"
              onPress={async () => {
                try {
                  // Lấy tất cả data CV (đã bao gồm title và photoCard)
                  const cvData = getCVData();

                  console.log('=== THÔNG TIN CV TRƯỚC KHI GỬI API ===');
                  console.log('Tiêu đề CV:', cvData.title);
                  console.log('Ảnh đại diện:', cvData.photoCard);
                  console.log('Template ID:', cvData.templateId);
                  console.log('Public Status:', cvData.isPublic);
                  console.log('=== CV DATA HOÀN CHỈNH ===');
                  console.log(JSON.stringify(cvData, null, 2));

                  // Hiển thị loading toast
                  Toast.show({
                    type: 'info',
                    text1: 'Đang tạo CV...',
                    text2: 'Vui lòng đợi',
                    visibilityTime: 2000,
                  });

                  // Gọi API tạo CV với ảnh
                  const imageUri = avatarUri; // URI ảnh thực tế từ device
                  const result = await createCV(cvData, imageUri);

                  // Hiển thị Toast thông báo thành công
                  Toast.show({
                    type: 'success',
                    text1: 'Tạo CV thành công! 🎉',
                    text2: `"${
                      cvData.title || 'CV không có tiêu đề'
                    }" đã được tạo`,
                    visibilityTime: 3000,
                  });

                  console.log('=== KẾT QUẢ TẠO CV ===');
                  console.log('API Response:', result);
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
          <NavBar title="Tạo CV" onPress={() => navigation.goBack()} />
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
              Login để tạo CV
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.white,
  },
  headerTitleContainer: {
    marginVertical: spacing.small,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.medium,
  },
  content: {
    flex: 1,
    marginVertical: spacing.medium,
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

export default CreateCVScreen;
