import React, { use, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Button,
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
const CreateCVScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [title, setTitle] = React.useState('');

  // Hàm điều hướng đến EditCVScreen
  const goToEditCV = (sectionKey, sectionTitle, fields) => {
    navigate(Screen_Name.EditCV_Screen, {
      title: sectionTitle,
      fields,
      onSave: data => {
        // TODO: xử lý lưu dữ liệu cho từng section
      },
    });
  };
  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity>
          <Image source={icons.back} style={AppStyles.icon} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <TextInput
            style={[AppStyles.title, { marginRight: spacing.small }]}
            placeholder="Enter CV Title"
            onChangeText={text => setTitle(text)}
            value={title}
          />
          <TouchableOpacity>
            <Image source={icons.edit} style={AppStyles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.contentWrap}>
          <View style={styles.headerContent}>
            <TouchableOpacity>
              <Image source={images.avt} style={styles.avtImage} />
            </TouchableOpacity>
            <View style={styles.info}>
              <TouchableOpacity style={styles.card}>
                <Text style={AppStyles.title}>John Doe</Text>
                <Text style={AppStyles.text}>Vị trí ứng tuyển</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userInfo} onPress={() => {}}>
                <Text>Ngày sinh: </Text>
                <Text>Giới tính: </Text>
                <Text>Số điện thoại: </Text>
                <Text>Email: </Text>
                <Text>Website: </Text>
                <Text>Địa chỉ: </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bodyContent}>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('careerGoal', 'Mục tiêu nghề nghiệp', [
                  {
                    key: 'careerGoal',
                    label: 'Mục tiêu nghề nghiệp',
                    placeholder: 'Nhập mục tiêu nghề nghiệp',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>MỤC TIÊU NGHỀ NGHIỆP</Text>
              </View>
              <Text>Nhập mục tiêu nghề nghiệp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('education', 'Học vấn', [
                  {
                    key: 'startDate',
                    label: 'Bắt đầu',
                    placeholder: 'Chọn ngày bắt đầu',
                  },
                  {
                    key: 'endDate',
                    label: 'Kết thúc',
                    placeholder: 'Chọn ngày kết thúc',
                  },
                  {
                    key: 'school',
                    label: 'Tên trường',
                    placeholder: 'Nhập tên trường',
                  },
                  {
                    key: 'major',
                    label: 'Ngành học/môn học',
                    placeholder: 'Nhập ngành/môn học',
                  },
                  {
                    key: 'desc',
                    label: 'Mô tả',
                    placeholder:
                      'Mô tả quá trình học tập hoặc thành tích của bạn',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>HỌC VẤN</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ width: '35%' }}>
                  <Text style={{ flex: 1 }}>Bắt đầu - Kết thúc</Text>
                </View>
                <View style={{ flexShrink: 1, width: '70%' }}>
                  <Text>Tên trường:</Text>
                  <Text>Ngành học/ môn học</Text>
                  <Text>Mô tả quá trình học tập hoặc thành tích của bạn</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('experience', 'Kinh nghiệm làm việc', [
                  {
                    key: 'startDate',
                    label: 'Bắt đầu',
                    placeholder: 'Chọn ngày bắt đầu',
                  },
                  {
                    key: 'endDate',
                    label: 'Kết thúc',
                    placeholder: 'Chọn ngày kết thúc',
                  },
                  {
                    key: 'company',
                    label: 'Tên công ty',
                    placeholder: 'Nhập tên công ty',
                  },
                  {
                    key: 'position',
                    label: 'Vị trí công việc',
                    placeholder: 'Nhập vị trí công việc',
                  },
                  {
                    key: 'desc',
                    label: 'Mô tả',
                    placeholder:
                      'Mô tả kinh nghiệm làm việc hoặc thành tích của bạn',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>KINH NGHIỆM LÀM VIỆC</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '35%' }}>
                  <Text style={{ flex: 1 }}>Bắt đầu - Kết thúc</Text>
                </View>
                <View style={{ flexShrink: 1, width: '70%' }}>
                  <Text>Tên công ty:</Text>
                  <Text>Vị trí công việc</Text>
                  <Text>
                    Mô tả kinh nghiệm làm việc hoặc thành tích của bạn
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('activity', 'Hoạt động', [
                  {
                    key: 'startDate',
                    label: 'Bắt đầu',
                    placeholder: 'Chọn ngày bắt đầu',
                  },
                  {
                    key: 'endDate',
                    label: 'Kết thúc',
                    placeholder: 'Chọn ngày kết thúc',
                  },
                  {
                    key: 'organization',
                    label: 'Tên tổ chức',
                    placeholder: 'Nhập tên tổ chức',
                  },
                  {
                    key: 'position',
                    label: 'Vị trí',
                    placeholder: 'Nhập vị trí',
                  },
                  {
                    key: 'desc',
                    label: 'Mô tả',
                    placeholder: 'Mô tả hoạt động',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>HOẠT ĐỘNG</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '35%' }}>
                  <Text style={{ flex: 1 }}>Bắt đầu - Kết thúc</Text>
                </View>
                <View style={{ flexShrink: 1, width: '70%' }}>
                  <Text>Tên tổ chức:</Text>
                  <Text>Vị trí</Text>
                  <Text>Mô tả hoạt động</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('certificate', 'Chứng chỉ', [
                  {
                    key: 'time',
                    label: 'Thời gian',
                    placeholder: 'Chọn thời gian',
                  },
                  {
                    key: 'name',
                    label: 'Tên chứng chỉ',
                    placeholder: 'Nhập tên chứng chỉ',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>CHỨNG CHỈ</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '35%' }}>
                  <Text style={{ flex: 1 }}>Thời gian</Text>
                </View>
                <View style={{ flexShrink: 1, width: '70%' }}>
                  <Text>Tên chứng chỉ</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('award', 'Danh hiệu & Giải thưởng', [
                  {
                    key: 'time',
                    label: 'Thời gian',
                    placeholder: 'Chọn thời gian',
                  },
                  {
                    key: 'name',
                    label: 'Tên giải thưởng',
                    placeholder: 'Nhập tên giải thưởng',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>DANH HIỆU VÀ GIẢI THƯỞNG</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '35%' }}>
                  <Text style={{ flex: 1 }}>Thời gian</Text>
                </View>
                <View style={{ flexShrink: 1, width: '70%' }}>
                  <Text>Tên giải thưởng</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('skill', 'Kỹ năng', [
                  {
                    key: 'name',
                    label: 'Tên kỹ năng',
                    placeholder: 'Nhập tên kỹ năng',
                  },
                  {
                    key: 'desc',
                    label: 'Mô tả kỹ năng',
                    placeholder: 'Mô tả kỹ năng',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>KỸ NĂNG</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '35%' }}>
                  <Text style={{ flex: 1 }}>Kỹ năng</Text>
                </View>
                <View style={{ flexShrink: 1, width: '70%' }}>
                  <Text>Mô tả kỹ năng</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('reference', 'Người giới thiệu', [
                  {
                    key: 'info',
                    label: 'Thông tin người giới thiệu',
                    placeholder: 'Nhập thông tin người giới thiệu',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>NGƯỜI GIỚI THIỆU</Text>
              </View>
              <View style={{}}>
                <View style={{ flexShrink: 1 }}>
                  <Text>Thông tin người giới thiệu</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bodyContentItem}
              onPress={() =>
                goToEditCV('hobby', 'Sở thích', [
                  {
                    key: 'hobby',
                    label: 'Sở thích',
                    placeholder: 'Điền các sở thích của bạn',
                  },
                ])
              }
            >
              <View style={styles.title_underLine}>
                <Text style={styles.title}>SỞ THÍCH</Text>
              </View>
              <View style={{}}>
                <View style={{ flexShrink: 1 }}>
                  <Text>Điền các sở thích của bạn</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.white,
  },
  headerTitleContainer: {
    flex: 1,
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
