import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import AppButton from '../../../../components/AppButton';
import LoadingScreen from '../../../../components/Loading';
import styles from './styles';
import NavBar from '../../../../components/Navbar';
import AppInput from '../../../../components/AppInput';
import { colors } from '../../../../utils/color';
import { spacing } from '../../../../utils/spacing';
import icons from '../../../../assets/icons';
import AppStyles from '../../../../components/AppStyle';
import { Fonts } from '../../../../utils/fontSize';
import { updatePassword } from '../../../../services/auth';
import Toast from 'react-native-toast-message';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate giống SetPassword
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatch = newPassword === confirmPassword;
  const isValid =
    hasMinLength && hasUpperCase && hasNumber && hasSpecialChar && isMatch;

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return false;
    }
    if (newPassword === currentPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return false;
    }
    if (!isValid) {
      setError('Mật khẩu mới chưa đủ điều kiện hoặc xác nhận không khớp');
      return false;
    }
    setError('');
    return true;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await updatePassword(currentPassword, newPassword);

      //   navigation.goBack();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar title="Đổi mật khẩu" onPress={() => navigation.goBack()} />
      <AppInput
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <AppInput
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <AppInput
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {/* Hiển thị các tiêu chí giống SetPassword */}
      <View style={{ marginBottom: spacing.xxlarge }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={hasMinLength ? icons.valid : icons.dot}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !newPassword
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
              color: !newPassword
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
              color: !newPassword
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
              color: !newPassword
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
              color: !newPassword
                ? colors.Gray
                : isMatch
                ? colors.Gray
                : colors.red,
            }}
          >
            Mật khẩu và xác nhận mật khẩu trùng khớp
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={
              newPassword && currentPassword && newPassword !== currentPassword
                ? icons.valid
                : icons.dot
            }
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: !newPassword
                ? colors.Gray
                : newPassword !== currentPassword
                ? colors.Gray
                : colors.red,
            }}
          >
            Mật khẩu mới phải khác mật khẩu hiện tại
          </Text>
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton
        title="Xác nhận"
        onPress={() => handleChangePassword()}
        disabled={
          !currentPassword || !newPassword || !confirmPassword || !isValid
        }
      />
      <LoadingScreen isLoading={loading} />
    </View>
  );
};

export default ChangePasswordScreen;
