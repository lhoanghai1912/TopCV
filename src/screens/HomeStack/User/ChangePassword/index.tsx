import React, { use, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import AppButton from '../../../../components/AppButton';
import LoadingScreen from '../../../../components/Loading';
import styles from './styles';
import NavBar from '../../../../components/Navbar';
import AppInput from '../../../../components/AppInput';
import { colors } from '../../../../utils/color';
import { spacing } from '../../../../utils/spacing';
import icons from '../../../../assets/icons';
import { updatePassword } from '../../../../services/auth';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = ({ navigation }) => {
  const { t } = useTranslation();

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
  const isMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return false;
    }
    if (newPassword === currentPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
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
      <NavBar
        title={t('label.account_changePassword')}
        onPress={() => navigation.goBack()}
        customStyle={{
          marginBottom: spacing.large,
          backgroundColor: colors.white,
        }}
      />
      <View style={styles.body}>
        <AppInput
          placeholder={t('label.password_current')}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <AppInput
          placeholder={t('label.password_new')}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <AppInput
          placeholder={t('label.password_confirm')}
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
              {t('message.valid_password_length')}
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
              {t('message.valid_password_uppercase')}
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
              {t('message.valid_password_number')}
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
              {t('message.valid_password_length')}
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
              {t('message.valid_password_match')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={
                newPassword &&
                currentPassword &&
                newPassword !== currentPassword
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
              {t('message.valid_password_dif')}
            </Text>
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AppButton
          title={t('button.confirm')}
          onPress={() => handleChangePassword()}
          disabled={!currentPassword || !newPassword || !confirmPassword}
        />
      </View>
      <LoadingScreen isLoading={loading} />
    </View>
  );
};

export default ChangePasswordScreen;
