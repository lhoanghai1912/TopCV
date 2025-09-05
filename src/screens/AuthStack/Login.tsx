import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import images from '../../assets/images';
import { ms, spacing } from '../../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles from '../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import AppInput from '../../components/AppInput';
import { colors } from '../../utils/color';
import icons from '../../assets/icons';
import { Fonts } from '../../utils/fontSize';
import AppButton from '../../components/AppButton';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import { login, loginFirebase } from '../../services/auth';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserData } from '../../store/reducers/userSlice';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const userData = useSelector((state: any) => state.user.userData);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await login(mail, password);

      dispatch(setToken({ token: res.token }));

      navigate(Screen_Name.BottomTab_Navigator);

      Toast.show({
        type: 'success',
        text1: `${t('message.welcome')} `,
        text2: `${t('message.welcome_back')} ${res.profile.fullName}`,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('closakjdfjsgjdf');

    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);

      const idToken = userInfo?.data?.idToken || '';
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('googleCredential', googleCredential);

      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      console.log('userCredential', userCredential);
      const firebaseIdToken = await userCredential.user.getIdToken();
      console.log('firebaseIdToken', firebaseIdToken);
      const res = await loginFirebase(firebaseIdToken);
      console.log('firebaseLogin', res);

      dispatch(setToken({ token: res.token }));
      navigate(Screen_Name.BottomTab_Navigator);
      console.log(userInfo);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text2: 'Đăng nhập Google thất bại',
        // text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Image
          source={images.company_logo}
          style={{
            resizeMode: 'contain',
            width: ms(250),
            height: ms(100),
            marginBottom: spacing.small,
          }}
        />
        <Image
          source={images.top_cv}
          style={{
            resizeMode: 'contain',
            width: ms(150),
            height: ms(70),
          }}
        />
        <Text style={AppStyles.text}>{t('message.welcome')}</Text>
      </View>

      <View style={styles.body}>
        <Text style={AppStyles.title}>{t('button.login')}</Text>
        <View>
          <AppInput
            leftIcon={icons.mail}
            value={mail}
            placeholder={t('label.username')}
            onChangeText={setMail}
            style={{ fontSize: Fonts.normal }}
          />
          <AppInput
            leftIcon={icons.password}
            placeholder={t('label.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ fontSize: Fonts.normal }}
          />
        </View>
        <TouchableOpacity>
          <Text
            style={[
              AppStyles.text,
              {
                textAlign: 'right',
                color: colors.blue,
                textDecorationLine: 'underline',
                marginBottom: spacing.medium,
              },
            ]}
          >
            {t('button.forgot_pw')}
          </Text>
        </TouchableOpacity>
        <AppButton
          title={t('button.login')}
          onPress={() => handleLogin()}
          textStyle={{ fontSize: Fonts.large }}
          customStyle={{ marginBottom: spacing.medium }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            marginBottom: spacing.medium,
          }}
        >
          <View style={[AppStyles.line, { width: '35%', flex: 1 }]} />
          <Text style={[AppStyles.text, { marginHorizontal: spacing.small }]}>
            {t('message.login')}
          </Text>
          <View style={[AppStyles.line, { width: '35%', flex: 1 }]} />
        </View>
        <View style={styles.iconGroup}>
          <TouchableOpacity
            style={{
              padding: spacing.small,
              borderWidth: 1,
              borderColor: colors.Gray,
              borderRadius: 50,
              marginRight: spacing.medium,
            }}
            onPress={() =>
              Toast.show({
                type: 'info',
                text2: `${t('message.comming_soon')}`,
              })
            }
          >
            <Image source={icons.facebook} style={[AppStyles.icon]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: spacing.small,
              borderWidth: 1,
              borderColor: colors.Gray,
              borderRadius: 50,
              marginRight: spacing.medium,
            }}
            onPress={() => handleGoogleLogin()}
          >
            <Image source={icons.google} style={[AppStyles.icon]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: spacing.small,
              borderWidth: 1,
              borderColor: colors.Gray,
              borderRadius: 50,
            }}
            onPress={() =>
              Toast.show({
                type: 'info',
                text2: `${t('message.comming_soon')}`,
              })
            }
          >
            <Image source={icons.apple} style={[AppStyles.icon]} />
          </TouchableOpacity>
        </View>
        <View style={styles.notHave_account}>
          <Text style={AppStyles.text}>{t('message.nothave_account')}</Text>
          <TouchableOpacity
            onPress={() => {
              navigate(Screen_Name.Register_Screen);
            }}
          >
            <Text
              style={[
                AppStyles.text,
                { color: colors.blue, marginLeft: spacing.small },
              ]}
            >
              {t('button.register')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            AppStyles.line,
            { width: '60%', alignSelf: 'center', marginBottom: spacing.medium },
          ]}
        />
        <TouchableOpacity
          onPress={() => navigate(Screen_Name.BottomTab_Navigator)}
        >
          <Text
            style={[
              AppStyles.text,
              { alignSelf: 'center', color: colors.blue },
            ]}
          >
            {t('message.guest')}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: colors.white,
  },
  header: { alignItems: 'center', marginBottom: spacing.xlarge },
  body: { paddingHorizontal: spacing.medium },
  iconGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: spacing.medium,
  },
  notHave_account: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
    alignSelf: 'center',
  },
});

export default LoginScreen;
