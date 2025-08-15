import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import styles from './styles';
import { ms, s, spacing } from '../../../../utils/spacing';
import { getCompanyDetails } from '../../../../services/company';
import { link } from '../../../../utils/constants';
import NavBar from '../../../../components/Navbar';
import icons from '../../../../assets/icons';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { colors } from '../../../../utils/color';
import AppStyles from '../../../../components/AppStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../../../../components/AppButton';
import CardCompany from '../CardCompany';
import CardJob from '../../Job/Card/CardJob';

interface Props {
  navigation: any;
  route: any;
}

const DetailsCompanyScreen: React.FC<Props> = ({ route, navigation }) => {
  console.log('data prop: ', route.params);
  const [companyDetail, setCompanyDetail] = useState<any>([]);
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [onCategory, setOnCategory] = useState('info');
  const [loading, setLoading] = useState(false);
  const staff = companyDetail?.companySize?.split('-')[0];
  const scrollRef = React.useRef<ScrollView>(null);
  const [mainTop, setMainTop] = useState(0);
  const [fixedHeaderH, setFixedHeaderH] = useState(0);
  useEffect(() => {
    if (route.params) {
      fetchCompanyDetails();
    }
  }, [route.params]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    const data = await getCompanyDetails(route.params.companyId);
    console.log('company Details', data);
    setCompanyDetail(data.data);
    setLoading(false);
  };
  console.log('fixedheader', fixedHeaderH, 'maintop', mainTop);

  const scrollToMain = () => {
    const y = Math.max(mainTop - fixedHeaderH, 0);
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  const setTab = (key: 'info' | 'job' | 'others') => {
    setOnCategory(key);
    requestAnimationFrame(scrollToMain); // tránh giật
  };
  const renderJobOfCompany = ({ item }: any) => {
    return (
      <View>
        <CardJob job={item} key={item.id} />
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {/* FIXED HEADER */}
      {showFixedHeader && (
        <View
          style={[styles.fixedHeader]}
          onLayout={e => setFixedHeaderH(e.nativeEvent.layout.height)}
        >
          <NavBar
            title={companyDetail?.name || ''}
            onPress={() => navigation.goBack()}
            icon1={icons.more}
            customStyle={[
              {
                paddingHorizontal: spacing.medium,
                backgroundColor: colors.white,
              },
            ]}
          />

          <ScrollView horizontal={true} style={styles.category}>
            <TouchableOpacity
              onPress={() => setTab('info')}
              style={{
                flex: 1,
                paddingHorizontal: spacing.medium,
                borderBottomWidth: 2,
                borderBottomColor:
                  onCategory === 'info' ? colors.blue : colors.Gray,
              }}
            >
              <Text style={AppStyles.text}>Giới thiệu công ty</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab('job')}
              style={{
                flex: 1,
                paddingHorizontal: spacing.medium,
                borderBottomWidth: 2,
                borderBottomColor:
                  onCategory === 'job' ? colors.blue : colors.Gray,
              }}
            >
              <Text style={AppStyles.text}>Tin tuyển dụng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab('others')}
              style={{
                flex: 1,
                paddingHorizontal: spacing.medium,
                borderBottomWidth: 2,
                borderBottomColor:
                  onCategory === 'others' ? colors.blue : colors.Gray,
              }}
            >
              <Text style={AppStyles.text}>Top công ty cùng lĩnh vực</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <ScrollView
        ref={scrollRef} // <-- THÊM DÒNG NÀY
        scrollEventThrottle={16}
        onScroll={e => {
          const y = e.nativeEvent.contentOffset.y;
          // chỉnh ngưỡng tuỳ banner/cover của bạn
          setShowFixedHeader(y > ms(fixedHeaderH - 20));
        }}
      >
        <View style={styles.container}>
          <ImageBackground
            style={{
              height: ms(150),
            }}
            resizeMode="cover"
            source={{
              uri:
                companyDetail.coverUrl &&
                /^https?:\/\//.test(companyDetail.coverUrl)
                  ? companyDetail.coverUrl
                  : `${link.url}${companyDetail.coverUrl}`,
            }}
          >
            <NavBar
              onPress={() => navigation.goBack()}
              icon1={icons.more}
              iconStyle={styles.customIcon}
              customStyle={[{ marginBottom: spacing.medium }]}
            />
          </ImageBackground>
          <View
            style={{
              backgroundColor: colors.white,
              paddingTop: ms(43),
              paddingBottom: spacing.medium,
            }}
          >
            <Image
              source={{
                uri:
                  companyDetail.logoUrl &&
                  /^https?:\/\//.test(companyDetail.logoUrl)
                    ? companyDetail.logoUrl
                    : `${link.url}${companyDetail.logoUrl}`,
              }}
              style={styles.companyLogo}
            />
            <Text style={[AppStyles.title, { textAlign: 'center' }]}>
              {companyDetail.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginBottom: spacing.medium,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={icons.apple}
                  style={{ height: ms(20), width: ms(20) }}
                />
                <Text
                  style={AppStyles.text}
                >{`${companyDetail?.followers?.length} người theo dõi`}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={icons.apple}
                  style={{ height: ms(20), width: ms(20) }}
                />
                <Text style={AppStyles.text}>{`${staff}+ nhân viên`}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing.medium,
                justifyContent: 'center',
              }}
            >
              <AppButton
                title={`Theo dõi công ty`}
                onPress={() => {}}
                leftIcon={icons.add}
                customStyle={{
                  alignItems: 'center',
                  paddingVertical: ms(5),
                  width: '85%',
                }}
              />

              <View
                style={{
                  backgroundColor: colors.Gray,
                  padding: ms(4),
                  borderRadius: 10,
                  marginLeft: spacing.small,
                }}
              >
                <Image
                  source={icons.share}
                  style={{ width: ms(25), height: ms(25), alignSelf: 'center' }}
                />
              </View>
            </View>
            <ScrollView horizontal={true} style={styles.category}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingHorizontal: spacing.medium,
                  borderBottomWidth: 2,
                  borderBottomColor:
                    onCategory === 'info' ? colors.blue : colors.Gray,
                }}
                onPress={() => setTab('info')}
              >
                <Text style={AppStyles.text}>Giới thiệu công ty</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingHorizontal: spacing.medium,
                  borderBottomWidth: 2,
                  borderBottomColor:
                    onCategory === 'job' ? colors.blue : colors.Gray,
                }}
                onPress={() => setTab('job')}
              >
                <Text style={AppStyles.text}>Tin tuyển dụng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingHorizontal: spacing.medium,
                  borderBottomWidth: 2,
                  borderBottomColor:
                    onCategory === 'others' ? colors.blue : colors.Gray,
                }}
                onPress={() => setTab('others')}
              >
                <Text style={AppStyles.text}>Top công ty cùng lĩnh vực</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View
            style={styles.mainContent}
            onLayout={e => setMainTop(e.nativeEvent.layout.y)}
          >
            {onCategory === 'info' ? (
              <>
                <View
                  style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: spacing.medium,
                    paddingBottom: spacing.medium,
                  }}
                >
                  <View
                    style={{
                      borderBottomColor: colors.Gray,
                      borderBottomWidth: 1,
                      paddingBottom: spacing.small,
                      marginBottom: spacing.medium,
                    }}
                  >
                    <Text style={styles.label}>{`Giới thiệu công ty`}</Text>
                    <Text
                      style={AppStyles.text}
                    >{`${companyDetail.description}`}</Text>
                  </View>
                  <View>
                    <Text style={styles.label}>{`Địa chỉ công ty`}</Text>
                    <Text
                      style={AppStyles.text}
                    >{`${companyDetail.address}`}</Text>
                  </View>
                </View>
                <View style={styles.other}>
                  <Text
                    style={[
                      styles.label,
                      { paddingHorizontal: spacing.medium },
                    ]}
                  >{`Tin tuyển dụng`}</Text>
                  <FlatList
                    scrollEnabled={false}
                    data={companyDetail?.jobs?.slice(0, 10)}
                    renderItem={renderJobOfCompany}
                    keyExtractor={item => item.id.toString()}
                  />
                </View>
              </>
            ) : onCategory === 'job' ? (
              <>
                <FlatList
                  style={{ paddingTop: spacing.medium }}
                  scrollEnabled={false}
                  data={companyDetail.jobs}
                  renderItem={renderJobOfCompany}
                  keyExtractor={item => item.id.toString()}
                ></FlatList>
              </>
            ) : (
              <></>
            )}
          </View>
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
      </ScrollView>
    </View>
  );
};

export default DetailsCompanyScreen;
