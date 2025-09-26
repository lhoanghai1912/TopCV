import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  AppState,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import styles from './styles';
import AppButton from '../../../components/AppButton';
import { navigate } from '../../../navigation/RootNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/reducers/userSlice';
import { Screen_Name } from '../../../navigation/ScreenName';
import { useTranslation } from 'react-i18next';
import i18n from '../../../language';
import { ms, spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';
import AppStyles from '../../../components/AppStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '../../../assets/icons';
import { getUserProfile } from '../../../services/auth';
import { useFocusEffect } from '@react-navigation/native';
import { link } from '../../../utils/constants';
import { getAppliedJobs, getSavedJobs } from '../../../services/job';
import Toast from 'react-native-toast-message';
import images from '../../../assets/images';
import { deleteUserAccount } from '../../../services/user';
import { colors } from '../../../utils/color';
import { getFollowedCompanies } from '../../../services/company';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';

const UserScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { token, userId } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [modalLanguage, setModalLanguage] = useState(false);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [listSavedJobs, setListSavedJobs] = useState<any>(null);
  const [listFollowedCompanies, setListFollowedCompanies] = useState<any>(null);
  const [listAppliedJobs, setListAppliedJobs] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state: any) => state.user.userData);

  useFocusEffect(
    React.useCallback(() => {
      if (!token) return;
      console.log('abc');
      fetchUserProfile();
      getListSavedJobs();
      getListFollowedCompanies();
      getListAppliedJobs();
      console.log('userId', userId);
      console.log('userData', userData);
    }, [token]),
  );

  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const res = await getUserProfile();
      console.log('userProfile', res);
      setUserProfile(res);
    } catch (error) {}
  };
  const getListSavedJobs = async () => {
    if (!token) return;
    try {
      const res = await getSavedJobs();
      setListSavedJobs(res);
    } catch (error) {}
  };
  const getListFollowedCompanies = async () => {
    if (!token) return;
    try {
      const res = await getFollowedCompanies();
      console.log('followed', res);
      setListFollowedCompanies(res);
    } catch (error) {}
  };
  const getListAppliedJobs = async () => {
    if (!token) return;
    try {
      const res = await getAppliedJobs();
      console.log('applied', res);
      setListAppliedJobs(res);
    } catch (error) {}
  };
  console.log('followed', listFollowedCompanies);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await GoogleSignin.signOut();
      await LoginManager.logOut();
      await auth().signOut();
    } catch (error) {
      // Có thể log lỗi nếu cần
    }
    setTimeout(() => {
      dispatch(logout());
      setListSavedJobs([]);
      setListFollowedCompanies([]);
      setLoading(false);
      navigate(Screen_Name.Login_Screen);
    });
  };
  // Danh sách ngôn ngữ
  const languages = [
    { code: 'vi', label: '🇻🇳 Tiếng Việt' },
    { code: 'lo', label: '🇱🇦 ພາສາລາວ' },
    { code: 'en', label: '🇬🇧 English' },
  ];

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setModalLanguage(false);
  };

  return (
    <View style={[styles.container]}>
      {showFixedHeader && (
        <View
          style={[
            styles.fixedHeader,
            {
              paddingTop: insets.top + spacing.small,
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: spacing.small,
            },
          ]}
        >
          <Image
            source={
              userProfile?.avatarUrl
                ? { uri: `${link.url}${userProfile?.avatarUrl}` }
                : userData?.avatarUrl
                ? { uri: userData?.avatarUrl }
                : images.avt_default
            }
            style={{
              width: ms(50),
              height: ms(50),
              borderRadius: ms(50),
              marginHorizontal: spacing.small,
              marginRight: spacing.medium,
            }}
          />
          <Text style={AppStyles.title}>{userProfile?.fullName}</Text>
        </View>
      )}
      <ScrollView
        style={[styles.container]}
        scrollEventThrottle={16}
        onScroll={event => {
          if (token) {
            const scrollY = event.nativeEvent.contentOffset.y;

            setShowFixedHeader(scrollY > ms(20));
          } else {
            setShowFixedHeader(false);
          }
        }}
      >
        <View style={styles.container}>
          {/* Header Profile */}
          <View
            style={{
              backgroundColor: '#1A7FEE',
              height: ms(80 + insets.top),
            }}
          ></View>
          <View style={[{ backgroundColor: 'white' }]}>
            <View style={{ marginTop: -60, alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: spacing.medium,
                  width: '90%',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Avatar */}
                  {token ? (
                    <>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: spacing.medium,
                        }}
                      >
                        <Image
                          source={
                            userProfile?.avatarUrl
                              ? { uri: `${link.url}${userProfile?.avatarUrl}` }
                              : userData?.avatarUrl
                              ? { uri: userData?.avatarUrl }
                              : images.avt_default
                          }
                          style={{
                            width: ms(80),
                            height: ms(80),
                            borderRadius: ms(50),
                          }}
                        />
                      </View>
                      <View
                        style={{
                          marginLeft: 12,
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                        >
                          {userProfile?.fullName}
                        </Text>
                        <Text
                          style={{
                            display:
                              userProfile?.phoneNumber || userData?.phoneNumber
                                ? 'flex'
                                : 'none',
                            color: '#888',
                            fontSize: Fonts.normal,
                          }}
                        >
                          {`${t(`label.phone`)}: ${
                            userProfile?.phoneNumber || userData?.phoneNumber
                          }`}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: spacing.medium,
                        }}
                      >
                        <Image
                          source={
                            userProfile?.avatarUrl
                              ? { uri: `${link.url}${userProfile?.avatarUrl}` }
                              : userData?.avatarUrl
                              ? { uri: userData?.avatarUrl }
                              : images.avt_default
                          }
                          style={{
                            width: ms(80),
                            height: ms(80),
                            borderRadius: ms(50),
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: spacing.medium,
                        }}
                      >
                        <Text
                          style={{
                            color: '#888',
                            fontSize: Fonts.normal,
                            textAlign: 'center',
                          }}
                        >
                          {t('message.login')}
                        </Text>
                        <AppButton
                          title={t('button.login')}
                          onPress={() => {
                            navigate(Screen_Name.Login_Screen);
                          }}
                          customStyle={{
                            marginTop: spacing.small,
                          }}
                        />
                      </View>
                    </>
                  )}
                  {/* Lock icon */}
                  <View style={{ marginLeft: 8 }}>
                    {/* Add lock icon here if available */}
                  </View>
                </View>
              </View>
            </View>
            {token && (
              <>
                {/* Info List */}
                <View
                  style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}
                >
                  {/* Kinh nghiệm làm việc */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: spacing.small,
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          AppStyles.label,
                          { fontWeight: '500', marginBottom: 8 },
                        ]}
                      >
                        {t(`label.exep`)}
                      </Text>
                      <Text
                        style={{ color: '#FF9800', fontSize: Fonts.normal }}
                      >
                        {t(`label.not_update`)}
                      </Text>
                    </View>
                    <Text style={{ color: '#1A7FEE', fontWeight: '500' }}>
                      {t(`button.edit`)}
                    </Text>
                  </View>
                  {/* Vị trí chuyên môn */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: spacing.small,
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          AppStyles.label,
                          { fontWeight: '500', marginBottom: 8 },
                        ]}
                      >
                        {t(`label.position`)}
                      </Text>
                      <Text
                        style={{ color: '#FF9800', fontSize: Fonts.normal }}
                      >
                        {t(`label.not_update`)}
                      </Text>
                    </View>
                    <Text style={{ color: '#1A7FEE', fontWeight: '500' }}>
                      {t(`button.edit`)}
                    </Text>
                  </View>
                  {/* Địa điểm làm việc mong muốn */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: spacing.small,
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          AppStyles.label,
                          { fontWeight: '500', marginBottom: 8 },
                        ]}
                      >
                        {t(`label.location_desire`)}
                      </Text>
                      <Text
                        style={{ color: '#FF9800', fontSize: Fonts.normal }}
                      >
                        {t(`label.not_update`)}
                      </Text>
                    </View>
                    <Text style={{ color: '#1A7FEE', fontWeight: '500' }}>
                      {t(`button.edit`)}
                    </Text>
                  </View>
                </View>
                {/* Quản lý hồ sơ */}
                <View
                  style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}
                >
                  <Text
                    style={[
                      AppStyles.label,
                      { fontWeight: '500', marginBottom: 8 },
                    ]}
                  >
                    {t(`label.profile_management`)}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: spacing.small,
                    }}
                  >
                    <Text style={{ flex: 1 }}>{t(`label.job_status`)}</Text>
                    {/* Switch component */}
                    <View style={{ marginLeft: 8 }}>
                      {/* Replace with <Switch /> from react-native */}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: spacing.small,
                    }}
                  >
                    <Text style={{ flex: 1 }}>{t(`label.contact_allow`)}</Text>
                    {/* Switch component */}
                    <View style={{ marginLeft: 8 }}>
                      {/* Replace with <Switch /> from react-native */}
                    </View>
                  </View>
                  <View style={{ marginLeft: 8, marginBottom: 8 }}>
                    <Text style={{ color: '#888', fontSize: Fonts.normal }}>
                      {t(`label.contact_by`)}
                    </Text>
                    <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                      {t(`label.contact_topCV`)}
                    </Text>
                    <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                      {t(`label.contact_phone`)}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* Quản lý tìm việc */}
            <View style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}>
              <Text
                style={[
                  AppStyles.label,
                  { fontWeight: '500', marginBottom: 8 },
                ]}
              >
                {t(`label.job_management`)}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    width: '48%',
                    backgroundColor: '#F5F5F5',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: spacing.small,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      token
                        ? navigate(Screen_Name.SavedJob_Screen)
                        : Toast.show({
                            type: 'error',
                            text1: t('message.login_save'),
                          });
                    }}
                  >
                    <Text style={{ color: '#1A7FEE' }}>
                      {t('label.job_saved')}
                    </Text>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {listSavedJobs?.data?.total
                        ? `${listSavedJobs.data.total}`
                        : '0'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '48%',
                    backgroundColor: '#F5F5F5',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: spacing.small,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      token
                        ? navigate(Screen_Name.FollowedCompany_Screen)
                        : Toast.show({
                            type: 'error',
                            text1: t('message.login_save'),
                          });
                    }}
                  >
                    <Text style={{ color: '#1A7FEE' }}>
                      {t('label.company_followed')}
                    </Text>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {listFollowedCompanies?.companies?.length
                        ? `${listFollowedCompanies.companies.length}`
                        : '0'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '48%',
                    backgroundColor: '#F5F5F5',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: spacing.small,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      token
                        ? navigate(Screen_Name.AppliedJob_Screen)
                        : Toast.show({
                            type: 'error',
                            text1: t('message.login_save'),
                          });
                    }}
                  >
                    <Text style={{ color: '#1A7FEE' }}>
                      {t('label.job_applied')}
                    </Text>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {listAppliedJobs?.total
                        ? `${listAppliedJobs.total}`
                        : '0'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {token && (
              <>
                <View
                  style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}
                >
                  <Text
                    style={[
                      AppStyles.label,
                      { fontWeight: '500', marginBottom: 8 },
                    ]}
                  >
                    {t('label.account_setting')}
                  </Text>
                  <View>
                    <TouchableOpacity
                      style={styles.link}
                      onPress={() => navigate(Screen_Name.UpdateInfo_Screen)}
                    >
                      <View>
                        <Text style={AppStyles.text}>
                          {t('label.account_update')}
                        </Text>
                      </View>
                      <View>
                        <Image source={icons.arrow} style={AppStyles.icon} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.link}
                    onPress={() => navigate(Screen_Name.UpdatePassword_Screen)}
                  >
                    <View>
                      <Text style={AppStyles.text}>
                        {t('label.account_changePassword')}
                      </Text>
                    </View>
                    <View>
                      <Image source={icons.arrow} style={AppStyles.icon} />
                    </View>
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      style={styles.link}
                      onPress={() => {
                        Alert.alert(
                          t('button.confirm'),
                          t('message.account_delete_confirm'),
                          [
                            {
                              text: t('button.cancel'),
                              style: 'cancel',
                            },
                            {
                              text: t('button.confirm'),
                              onPress: async () => {
                                setLoading(true);
                                try {
                                  const res = await deleteUserAccount();
                                  Toast.show({
                                    type: 'success',
                                    text1: res.message,
                                  });
                                } finally {
                                  setLoading(false);
                                }
                              },
                            },
                          ],
                          { cancelable: true },
                        );
                      }}
                    >
                      <View>
                        <Text style={AppStyles.text}>
                          {t('label.account_delete')}
                        </Text>
                      </View>
                      <View>
                        <Image source={icons.arrow} style={AppStyles.icon} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            {/*  Cài đặt tài khoản */}
            <View
              style={{
                marginTop: spacing.medium,
                paddingHorizontal: 20,
                marginBottom: spacing.medium,
              }}
            >
              <Text
                style={[
                  AppStyles.label,
                  { fontWeight: '500', marginBottom: spacing.small },
                ]}
              >
                {t('label.account_setting')}
              </Text>
              <View>
                <TouchableOpacity
                  style={styles.link}
                  onPress={() => Linking.openURL(link.company)}
                >
                  <View>
                    <Text style={AppStyles.text}>{t('label.about_us')}</Text>
                  </View>
                  <View>
                    <Image source={icons.arrow} style={AppStyles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.link}
                  onPress={() => Linking.openURL(link.terms)}
                >
                  <View>
                    <Text style={AppStyles.text}>
                      {t('label.term_conditions')}
                    </Text>
                  </View>
                  <View>
                    <Image source={icons.arrow} style={AppStyles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.link}
                  onPress={() => Linking.openURL(link.privacy)}
                >
                  <View>
                    <Text style={AppStyles.text}>
                      {t('label.privacy_policy')}
                    </Text>
                  </View>
                  <View>
                    <Image source={icons.arrow} style={AppStyles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.link}
                  onPress={() => setModalLanguage(true)}
                >
                  <View>
                    <Text style={AppStyles.text}>{t('label.language')}</Text>
                  </View>
                  <View>
                    <Image source={icons.arrow} style={AppStyles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {token && (
            <View>
              <AppButton
                title={t('button.logout')}
                onPress={() => handleLogout()}
                customStyle={{ marginBottom: spacing.medium }}
              />
            </View>
          )}
        </View>
      </ScrollView>
      {/* Modal chuyển đổi ngôn ngữ */}
      <Modal
        visible={modalLanguage}
        transparent
        animationType="fade"
        onRequestClose={() => setModalLanguage(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 15,
              padding: spacing.medium,
              width: '60%',
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: Fonts.normal,
                marginBottom: spacing.medium,
                textAlign: 'center',
              }}
            >
              {t('button.choose_language')}
            </Text>
            {languages.map(lang => (
              <Pressable
                key={lang.code}
                onPress={() => handleChangeLanguage(lang.code)}
                style={({ pressed }) => [
                  {
                    // paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    paddingVertical: spacing.small,
                    paddingHorizontal: spacing.medium,
                    backgroundColor:
                      i18n.language === lang.code
                        ? colors.primary
                        : colors.white,
                    color:
                      i18n.language === lang.code ? colors.white : colors.black,
                  }}
                >
                  {lang.label}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setModalLanguage(false)}
              style={{ marginTop: 12, alignItems: 'center' }}
            >
              <Text
                style={{ color: '#1A7FEE', fontWeight: 'bold', fontSize: 16 }}
              >
                {t('button.close')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

export default UserScreen;
