import React, { use } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles from '../../../components/AppStyle';
import icons from '../../../assets/icons';
import { ms, spacing } from '../../../utils/spacing';
import { TextInput } from 'react-native-gesture-handler';
import { colors } from '../../../utils/color';
import images from '../../../assets/images';
import { Fonts } from '../../../utils/fontSize';
const CreateCVScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = React.useState('');
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
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>MỤC TIÊU NGHỀ NGHIỆP</Text>
              </View>
              <Text>Nhập mục tiêu nghề nghiệp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>HỌC VẤN</Text>
              </View>
              <Text>Nhập thông tin học vấn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>KINH NGHIỆM LÀM VIỆC</Text>
              </View>
              <Text>Nhập thông tin kinh nghiệm làm việc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>HOẠT ĐỘNG</Text>
              </View>
              <Text>Nhập thông tin hoạt động</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>CHỨNG CHỈ</Text>
              </View>
              <Text>Nhập thông tin chứng chỉ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>DANH HIỆU VÀ GIẢI THƯỞNG</Text>
              </View>
              <Text>Nhập thông tin danh hiệu và giải thưởng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>KỸ NĂNG</Text>
              </View>
              <Text>Nhập thông tin kỹ năng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>NGƯỜI GIỚI THIỆU</Text>
              </View>
              <Text>Nhập thông tin người giới thiệu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bodyContentItem}>
              <View style={styles.title_underLine}>
                <Text style={styles.title}>SỞ THÍCH</Text>
              </View>
              <Text>Nhập thông tin sở thích</Text>
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
