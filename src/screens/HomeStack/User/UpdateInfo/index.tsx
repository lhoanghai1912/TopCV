import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './styles';
import AppButton from '../../../../components/AppButton';
import NavBar from '../../../../components/Navbar';
import {
  getUserInfo,
  updateUserInfo,
  uploadUserAvatar,
} from '../../../../services/user';
import { colors } from '../../../../utils/color';
import { link } from '../../../../utils/constants';
import Toast from 'react-native-toast-message';
import images from '../../../../assets/images';
import { useTranslation } from 'react-i18next';

const UpdateInfoScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(`${images.avt}`);
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  console.log('avatarUrl', avatarUrl);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const res = await getUserInfo();
      if (res) {
        setFullName(res.fullName);
        setPhoneNumber(res.phoneNumber);
        setAvatarUrl(`${link.url}${res.avatarUrl}`);
        setEmail(res.email);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        alert('Lỗi chọn ảnh: ' + response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri as string;
        console.log('uri', uri);

        setAvatarUrl(uri);
        try {
          setLoading(true);
          // Có thể reload lại thông tin user nếu cần
        } catch (error) {
          alert('Upload ảnh thất bại');
          console.log('abc', error);
        } finally {
          setLoading(false);
        }
      }
    });
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await updateUserInfo({
        fullName,
        phoneNumber,
        avatarUrl,
      });
      const res1 = await uploadUserAvatar(avatarUrl);
      Toast.show({
        type: 'success',
        text2: res.message || res1.message,
      });
    } catch (error) {
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <NavBar
        title={t('label.update_info')}
        onPress={() => navigation.goBack()}
        customStyle={{ backgroundColor: colors.white }}
      />
      <View style={styles.body}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatarUrl !== `${link.url}` ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text>{t('label.update_image')}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.input, { backgroundColor: colors.Gray }]}>
          {email}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t('label.fullname')}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder={t('label.phone')}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <AppButton title={t('button.confirm')} onPress={handleSave} />
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

export default UpdateInfoScreen;
