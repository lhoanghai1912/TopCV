import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AppButton from '../../../../components/AppButton';
import LoadingScreen from '../../../../components/Loading';
import styles from './styles';
import NavBar from '../../../../components/Navbar';

const UpdatePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải từ 6 ký tự trở lên');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    setError('');
    return true;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: Gọi API đổi mật khẩu
      // await changePasswordApi({ oldPassword, newPassword });
      navigation.goBack();
    } catch (e) {
      setError('Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar title="Đổi mật khẩu" onPress={() => navigation.goBack()} />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title="Xác nhận" onPress={handleChangePassword} />
      <LoadingScreen isLoading={loading} />
    </View>
  );
};

export default UpdatePasswordScreen;
