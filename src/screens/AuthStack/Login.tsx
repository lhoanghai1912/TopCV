import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
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
import {
  setToken,
  setUserData,
  setUserId,
} from '../../store/reducers/userSlice';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, {
  FacebookAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { AccessToken, LoginManager, Profile } from 'react-native-fbsdk-next';
import CookieManager from '@react-native-cookies/cookies';

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await login(mail, password);
      console.log('login res', res);
      dispatch(setUserId({ userId: res.id }));
      dispatch(setUserData({ userData: res.profile }));
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
    try {
      setLoading(true);
      console.log('abciawd');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      const idToken = userInfo?.data?.idToken || '';
      console.log('idToken', idToken);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('googleCredential', googleCredential);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      const firebaseIdToken = await userCredential.user.getIdToken();
      console.log('firebaseIdToken', firebaseIdToken);
      const res = await loginFirebase(firebaseIdToken);
      dispatch(setToken({ token: res.token }));
      dispatch(setUserId({ userId: res.id }));
      console.log('token', res.token);
      navigate(Screen_Name.BottomTab_Navigator);
      console.log('userInfo', userInfo);
    } catch (error) {
      console.log('Google login error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      await CookieManager.clearAll(true); // Clear all cookies (Android/iOS)
      LoginManager.setLoginBehavior('web_only');

      const result = await LoginManager.logInWithPermissions(
        ['public_profile', 'email'],
        'enabled',
      );
      if (result.isCancelled) return;

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        console.log('[FB-LOGIN] Không lấy được access token');
        return;
      }
      const token = data.accessToken.toString();

      // Test nhanh: token dùng được với Graph API?
      const me = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${token}`,
      ).then(r => r.json());
      console.log('[FB-LOGIN] Graph /me =', me);

      // Firebase
      const facebookCredential = auth.FacebookAuthProvider.credential(token);
      const userCredential = await auth().signInWithCredential(
        facebookCredential,
      );
      console.log('[FB-LOGIN] Firebase user =', userCredential.user.uid);

      const firebaseIdToken = await userCredential.user.getIdToken();
      const res = await loginFirebase(firebaseIdToken);
      console.log('[FB-LOGIN] backend res =', res);

      dispatch(setToken({ token: res.token }));
      dispatch(setUserId({ userId: res.id }));
      dispatch(
        setUserData({
          userData: {
            address: '',
            avatarUrl: me?.picture?.data?.url,
            dateOfBirth: '',
            email: me?.email,
            fullName: me?.name,
            gender: '',
            phoneNumber: '',
            taxCode: '',
          },
        }),
      );
      navigate(Screen_Name.BottomTab_Navigator);
    } catch (e: any) {
      console.log('[FB-LOGIN] error code:', e?.code);
      console.log('[FB-LOGIN] error message:', e?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginTop: ms(insets.top + 80) }]}>
        <Image
          source={images.company_logo}
          style={{
            resizeMode: 'contain',
            width: ms(250),
            height: ms(100),
            marginBottom: spacing.small,
          }}
        />
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
          {/* Facebook button: luôn hiển thị trên Android/iOS */}
          <TouchableOpacity
            style={{
              padding: spacing.small,
              borderWidth: 1,
              borderColor: colors.Gray,
              borderRadius: 50,
              marginRight: spacing.medium,
            }}
            onPress={() =>
              // Toast.show({
              //   type: 'info',
              //   text2: `${t('message.comming_soon')}`,
              // })
              handleFacebookLogin()
            }
          >
            <Image source={icons.facebook} style={[AppStyles.icon]} />
          </TouchableOpacity>
          {/* Google button: luôn hiển thị trên Android/iOS */}
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
          {/* Apple button: chỉ hiển thị trên iOS */}
          {Platform.OS === 'ios' && (
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
          )}
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
