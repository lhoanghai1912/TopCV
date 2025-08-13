import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  AppState,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import AppButton from '../../../components/AppButton';
import { navigate } from '../../../navigation/RootNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/reducers/userSlice';
import { Screen_Name } from '../../../navigation/ScreenName';
import { useTranslation } from 'react-i18next';
import { ms, spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';
import AppStyles from '../../../components/AppStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '../../../assets/icons';
import { getUserProfile } from '../../../services/auth';
import { useFocusEffect } from '@react-navigation/native';
import App from '../../../App';
import { link } from '../../../utils/constants';
import { getSavedJobs } from '../../../services/job';
import Toast from 'react-native-toast-message';

const UserScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const token = useSelector((state: any) => state.user.token);
  const dispatch = useDispatch();
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [listSavedJobs, setListSavedJobs] = useState<any>(null);
  useFocusEffect(
    React.useCallback(() => {
      if (!token) return;
      console.log('abc');
      fetchUserProfile();
      getListSavedJobs();
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
  const handleLogout = () => {
    dispatch(logout());
    setListSavedJobs([]);
  };
  return (
    <View style={styles.container}>
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
                : icons.add
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
        style={[styles.container, { backgroundColor: 'red' }]}
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
              height: ms(120),
            }}
          >
            {/* ...background pattern if needed... */}
          </View>
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
                          source={{
                            uri: `${link.url}${userProfile?.avatarUrl}`,
                          }}
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
                        <Text style={{ color: '#888', fontSize: Fonts.normal }}>
                          {`Số điện thoại: ${userProfile?.phoneNumber}`}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          width: ms(80),
                          height: ms(80),
                          borderRadius: ms(50),
                          backgroundColor: '#E5E5E5',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: spacing.medium,
                        }}
                      ></View>
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
                          Vui lòng đăng nhập
                        </Text>
                        <AppButton
                          title="Đăng nhập"
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
            {/* Info List */}
            <View style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}>
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
                    Kinh nghiệm làm việc
                  </Text>
                  <Text style={{ color: '#FF9800', fontSize: Fonts.normal }}>
                    Chưa cập nhật
                  </Text>
                </View>
                <Text style={{ color: '#1A7FEE', fontWeight: '500' }}>Sửa</Text>
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
                    Vị trí chuyên môn
                  </Text>
                  <Text style={{ color: '#FF9800', fontSize: Fonts.normal }}>
                    Chưa cập nhật
                  </Text>
                </View>
                <Text style={{ color: '#1A7FEE', fontWeight: '500' }}>Sửa</Text>
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
                    Địa điểm làm việc mong muốn
                  </Text>
                  <Text style={{ color: '#FF9800', fontSize: Fonts.normal }}>
                    Chưa cập nhật
                  </Text>
                </View>
                <Text style={{ color: '#1A7FEE', fontWeight: '500' }}>Sửa</Text>
              </View>
            </View>

            {/* Quản lý hồ sơ */}
            <View style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}>
              <Text
                style={[
                  AppStyles.label,
                  { fontWeight: '500', marginBottom: 8 },
                ]}
              >
                Quản lý hồ sơ
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing.small,
                }}
              >
                <Text style={{ flex: 1 }}>Trạng thái tìm việc</Text>
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
                <Text style={{ flex: 1 }}>Cho phép NTD liên hệ</Text>
                {/* Switch component */}
                <View style={{ marginLeft: 8 }}>
                  {/* Replace with <Switch /> from react-native */}
                </View>
              </View>
              <View style={{ marginLeft: 8, marginBottom: 8 }}>
                <Text style={{ color: '#888', fontSize: Fonts.normal }}>
                  NTD có thể liên hệ tôi qua:
                </Text>
                <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                  Nhắn tin qua TopConnect
                </Text>
                <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                  Email và số điện thoại
                </Text>
              </View>
            </View>

            {/* Quản lý hồ sơ */}
            <View style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}>
              <Text
                style={[
                  AppStyles.label,
                  { fontWeight: '500', marginBottom: 8 },
                ]}
              >
                Quản lý hồ sơ
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing.small,
                }}
              >
                <Text style={{ flex: 1 }}>Trạng thái tìm việc</Text>
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
                <Text style={{ flex: 1 }}>Cho phép NTD liên hệ</Text>
                {/* Switch component */}
                <View style={{ marginLeft: 8 }}>
                  {/* Replace with <Switch /> from react-native */}
                </View>
              </View>
              <View style={{ marginLeft: 8, marginBottom: 8 }}>
                <Text style={{ color: '#888', fontSize: Fonts.normal }}>
                  NTD có thể liên hệ tôi qua:
                </Text>
                <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                  Nhắn tin qua TopConnect
                </Text>
                <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                  Email và số điện thoại
                </Text>
              </View>
            </View>

            {/* Quản lý hồ sơ */}
            <View style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}>
              <Text
                style={[
                  AppStyles.label,
                  { fontWeight: '500', marginBottom: 8 },
                ]}
              >
                Quản lý hồ sơ
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing.small,
                }}
              >
                <Text style={{ flex: 1 }}>Trạng thái tìm việc</Text>
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
                <Text style={{ flex: 1 }}>Cho phép NTD liên hệ</Text>
                {/* Switch component */}
                <View style={{ marginLeft: 8 }}>
                  {/* Replace with <Switch /> from react-native */}
                </View>
              </View>
              <View style={{ marginLeft: 8, marginBottom: 8 }}>
                <Text style={{ color: '#888', fontSize: Fonts.normal }}>
                  NTD có thể liên hệ tôi qua:
                </Text>
                <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                  Nhắn tin qua TopConnect
                </Text>
                <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                  Email và số điện thoại
                </Text>
              </View>
            </View>

            {/* Quản lý hồ sơ */}
            <View style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}>
              <Text
                style={[
                  AppStyles.label,
                  { fontWeight: '500', marginBottom: 8 },
                ]}
              >
                Quản lý hồ sơ
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing.small,
                }}
              >
                <Text style={{ flex: 1 }}>Trạng thái tìm việc</Text>
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
                <Text style={{ flex: 1 }}>Cho phép NTD liên hệ</Text>
                {/* Switch component */}
                <View style={{ marginLeft: 8 }}>
                  {/* Replace with <Switch /> from react-native */}
                </View>
              </View>
              <View style={{ marginLeft: 8, marginBottom: 8 }}>
                <Text style={{ color: '#888', fontSize: Fonts.normal }}>
                  NTD có thể liên hệ tôi qua:
                </Text>
                <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                  Nhắn tin qua TopConnect
                </Text>
                <Text style={{ color: '#1A7FEE', fontSize: Fonts.normal }}>
                  Email và số điện thoại
                </Text>
              </View>
            </View>

            {/* Quản lý tìm việc */}
            <View style={{ marginTop: spacing.medium, paddingHorizontal: 20 }}>
              <Text
                style={[
                  AppStyles.label,
                  { fontWeight: '500', marginBottom: 8 },
                ]}
              >
                Quản lý tìm việc
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
                  <Text style={{ color: '#1A7FEE' }}>
                    Việc làm đã ứng tuyển
                  </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: Fonts.normal }}>
                    2
                  </Text>
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
                        ? navigate(Screen_Name.SavedJob_Screen)
                        : Toast.show({
                            type: 'error',
                            text1: 'Please login to view saved jobs',
                          });
                    }}
                  >
                    <Text style={{ color: '#1A7FEE' }}>Việc làm đã lưu</Text>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: Fonts.normal }}
                    >
                      {listSavedJobs?.data?.length || 0}
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
                  <Text style={{ color: '#1A7FEE' }}>Việc làm phù hợp</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: Fonts.normal }}>
                    120
                  </Text>
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
                  <Text style={{ color: '#1A7FEE' }}>
                    Công ty đang theo dõi
                  </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: Fonts.normal }}>
                    0
                  </Text>
                </View>
              </View>
            </View>
            {token && (
              <View>
                <Text style={{ color: '#888', fontSize: Fonts.normal }}>
                  Thông tin bổ sung
                </Text>
                <AppButton title="LOGOUT " onPress={() => handleLogout()} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserScreen;
