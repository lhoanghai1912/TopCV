import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
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
import ModalEnterOtp from '../../components/modal/ModalEnterOtp';
import { enterOtp, register } from '../../services/auth';
import LoginScreen from './Login';

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [mail, setMail] = useState('');
  const [modalEnterOtp, setModalEnterOtp] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [Loading, setLoading] = useState(false);

  const handleregister = async () => {
    try {
      setLoading(true);
      const res = await register(mail);
      console.log(res);

      setModalEnterOtp(true);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: ms(insets.top + 80) }]}>
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
        <Text style={AppStyles.title}>{t('button.register')}</Text>
        <View>
          <AppInput
            leftIcon={icons.mail}
            value={mail}
            placeholder={t('label.mail')}
            onChangeText={setMail}
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
          title={t('button.register')}
          onPress={() => handleregister()}
          textStyle={{ fontSize: Fonts.large }}
          customStyle={{ marginBottom: spacing.medium }}
        />
        {/* <View
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
            {t('message.other_register')}
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
          >
            <Image source={icons.apple} style={[AppStyles.icon]} />
          </TouchableOpacity>
        </View> */}
        <View style={styles.notHave_account}>
          <Text style={AppStyles.text}>{t('message.have_account')}</Text>
          <TouchableOpacity
            onPress={() => {
              navigate(Screen_Name.Login_Screen);
            }}
          >
            <Text
              style={[
                AppStyles.text,
                { color: colors.blue, marginLeft: spacing.small },
              ]}
            >
              {t('button.login')}
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
      <ModalEnterOtp
        visible={modalEnterOtp}
        onClose={() => setModalEnterOtp(false)}
        onSuccess={otp => {
          setResetOtp(otp);
          setModalEnterOtp(false);
          navigate(Screen_Name.SetPassword_Screen, { mail, otp });
        }}
        contact={mail}
      />
      {Loading && (
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

export default RegisterScreen;
