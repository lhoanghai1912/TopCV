import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { create_password } from '../../services/auth';
import { setToken, setUserData } from '../../store/reducers/userSlice';
import images from '../../assets/images';
import { spacing } from '../../utils/spacing';
import AppInput from '../../components/AppInput';
import icons from '../../assets/icons';
import AppButton from '../../components/AppButton';
import { colors } from '../../utils/color';
import NavBar from '../../components/Navbar';
import { Picker } from '@react-native-picker/picker';
import AppStyles from '../../components/AppStyle';
import { Fonts } from '../../utils/fontSize';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';

interface Props {
  navigation: any;
  route: any;
}
const SetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { verificationToken } = useSelector((state: any) => state.user);

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [password, SetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isMatch = password === confirmPassword;
  const isValid =
    hasMinLength && hasUpperCase && hasNumber && hasSpecialChar && isMatch;
  console.log('abcd', route.params);

  const handleRegister = async () => {
    if (!isMatch) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Mật khẩu và xác nhận mật khẩu chưa trùng khớp',
      });
    } else {
      try {
        setLoading(true);
        // Giả định bạn có username/email ở biến tạm, ví dụ hardcoded hoặc truyền props
        const res = await create_password(
          verificationToken,
          password,
          confirmPassword,
          fullName,
          role,
          phoneNumber,
        );
        console.log('output', res);

        dispatch(setToken({ token: res.accessToken }));
        dispatch(setUserData({ token: res.user }));

        Toast.show({
          type: 'success',
          text2: 'Tài khoản đã được tạo và đăng nhập thành công',
        });
        navigate(Screen_Name.Home_Screen);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={[styles.container]}>
      <NavBar title={'Tạo mật khẩu'} onPress={() => navigation.goBack()} />
      <View style={{ marginBottom: spacing.large }}>
        <Image
          source={images.company_logo}
          style={{
            width: 170,
            height: 100,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
      </View>
      <View>
        <AppInput
          label="Họ tên"
          leftIcon={icons.username}
          placeholder="Nhập số Họ tên"
          onChangeText={setFullName}
          value={fullName}
        />
      </View>

      <View>
        <AppInput
          label="Mật khẩu"
          leftIcon={icons.password}
          placeholder="Nhập số mật khẩu"
          onChangeText={SetPassword}
          secureTextEntry={true}
          value={password}
        />
      </View>
      <View>
        <AppInput
          label="Xác nhận mật khẩu"
          leftIcon={icons.password}
          placeholder="Xác nhận mật khẩu"
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          value={confirmPassword}
        />
      </View>
      <View>
        <Text style={AppStyles.label}>Vai trò</Text>
        <View style={styles.picker}>
          {/* Icon bên trái */}
          <Image
            source={icons.role} // đổi sang icon bạn muốn
            style={{ width: 35, height: 35, marginRight: spacing.small }}
            resizeMode="contain"
          />

          {/* Picker */}
          <Picker
            style={{
              flex: 1,
              fontSize: Fonts.normal,
              height: 50,
            }}
            selectedValue={role}
            onValueChange={itemValue => setRole(itemValue)}
            dropdownIconColor="black" // Màu icon mũi tên
          >
            <Picker.Item label="Admin" value="Admin" />
            <Picker.Item label="User" value="User" />
            <Picker.Item label="HR" value="HR" />
          </Picker>
        </View>
      </View>
      <View>
        <AppInput
          label="Số điện thoại"
          leftIcon={icons.phone}
          placeholder="Nhập số điện thoại"
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
      </View>
      <View style={{ marginBottom: spacing.xxlarge }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasMinLength ? icons.valid : icons.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? colors.Gray
                : hasMinLength
                ? colors.Gray
                : colors.red,
            }}
          >
            Mật khẩu tối thiểu 8 ký tự
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasUpperCase ? icons.valid : icons.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? colors.Gray
                : hasUpperCase
                ? colors.Gray
                : colors.red,
            }}
          >
            Chứa ít nhất 1 ký tự viết hoa
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasNumber ? icons.valid : icons.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? colors.Gray
                : hasNumber
                ? colors.Gray
                : colors.red,
            }}
          >
            Chứa ít nhất 1 ký tự số
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasSpecialChar ? icons.valid : icons.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? colors.Gray
                : hasSpecialChar
                ? colors.Gray
                : colors.red,
            }}
          >
            Chứa ít nhất 1 ký tự đặc biệt
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={isMatch ? icons.valid : icons.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !password
                ? colors.Gray
                : isMatch
                ? colors.Gray
                : colors.red,
            }}
          >
            Mật khẩu và xác nhận mật khẩu trùng khớp
          </Text>
        </View>
      </View>
      {/* <View
        style={{
          borderWidth: 0.5,
          marginBottom: spacing.medium,
        }}
      /> */}
      <View style={{ marginBottom: spacing.xlarge }}>
        <AppButton
          title="Đăng ký"
          onPress={handleRegister}
          disabled={!password || !confirmPassword || !isValid}
        />
      </View>
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.white,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#F4F5F5',
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.medium,
  },
});

export default SetPasswordScreen;
