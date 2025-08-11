import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJobDetails, getJobofCompany } from '../../../../services/job';
import NavBar from '../../../../components/Navbar';
import icons from '../../../../assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { link } from '../../../../utils/constants';
import AppStyles from '../../../../components/AppStyle';
import { ms, spacing } from '../../../../utils/spacing';
import { colors } from '../../../../utils/color';
import { formatPriceToTy } from '../../../../components/formatPrice';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Fonts } from '../../../../utils/fontSize';
import moment from 'moment';
import AppButton from '../../../../components/AppButton';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import CardJob from '../Card/CardJob';
import { Screen_Name } from '../../../../navigation/ScreenName';
import { navigate } from '../../../../navigation/RootNavigator';
interface Props {
  navigation: any;
  route: any;
}

const DetailJobScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  console.log('job id: ', route.params.job.id);
  const { token } = useSelector((state: any) => state.user);
  const [jobDetails, setJobDetails] = useState<any>([]);
  const [listJobsOfCompany, setListJobsOfCompany] = useState<any>([]);
  const [onSelectedCategory, setOnSelectedCategory] = useState('info');
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const companyId = jobDetails?.company?.id;
  const jobId = route.params?.job?.id;

  const scrollRef = React.useRef<ScrollView>(null);
  const [mainTop, setMainTop] = useState(0);
  const [fixedHeaderH, setFixedHeaderH] = useState(0);
  const [mainContent, setMainContent] = useState(0);

  const jobOverview = [
    {
      icon: icons.apple,
      label: 'Hạn ứng tuyển',
      value: moment(jobDetails.applicationDeadline).format('DD/MM/YYYY'),
    },
    { icon: icons.apple, label: 'Cấp bậc', value: jobDetails.jobLevelName },

    {
      icon: icons.apple,
      label: 'Trình độ giáo dục',
      value: jobDetails.educationLevelName,
    },
    {
      icon: icons.apple,
      label: 'Số lượng ứng tuyển',
      value: jobDetails.numberOfVacancies,
    },
    {
      icon: icons.apple,
      label: 'Hình thức làm việc',
      value: jobDetails.jobTypeName,
    },
  ];
  useEffect(() => {
    fetchJobDetails();
  }, [route.params.job.id]);

  useEffect(() => {
    if (companyId) {
      fetchJobOfCompany();
    }
  }, [jobDetails]);

  useEffect(() => {
    // Lọc công việc có id khác với currentJob.id
    const filtered = listJobsOfCompany?.filter(job => job.id !== jobDetails.id);
    setFilteredJobs(filtered);
  }, [listJobsOfCompany, jobDetails]);

  const fetchJobDetails = async () => {
    setLoading(true);
    const data = await getJobDetails(jobId);
    setJobDetails(data);
    console.log('data', data);
    setLoading(false);
  };

  const fetchJobOfCompany = async () => {
    const data = await getJobofCompany(companyId);
    setListJobsOfCompany(data);
    console.log('job of company', data);
  };

  const handleLinkPress = link => {
    Linking.openURL(link).catch(err =>
      console.error('Failed to open URL', err),
    );
  };

  const scrollToMain = () => {
    // Scroll đến vị trí fixedHeaderH (đầu header mới)
    showFixedHeader;
    scrollRef.current?.scrollTo({ y: fixedHeaderH, animated: true });
  };
  console.log(
    'fixedHeaderH',
    fixedHeaderH,
    'MainTop',
    mainTop,
    'mainContent',
    mainContent,
  );

  const setTab = (key: 'info' | 'company') => {
    setOnSelectedCategory(key);
    requestAnimationFrame(scrollToMain); // Prevent jitter when scrolling
  };
  const renderJob = ({ item }: any) => {
    return (
      <>
        <CardJob
          job={item}
          style={{ marginHorizontal: 0, backgroundColor: colors.white }}
        />
        <View style={{ marginBottom: spacing.medium }} />
      </>
    );
  };

  const applyNow = () => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Cần đăng nhập để thực hiện tính năng này',
        visibilityTime: 1500,
      });
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {showFixedHeader && (
        <View
          style={styles.fixedHeader}
          onLayout={e => setFixedHeaderH(e.nativeEvent.layout.height)}
        >
          <NavBar
            title={jobDetails?.title || ''}
            onPress={() => navigation.goBack()}
            icon1={icons.more}
            customStyle={[
              {
                paddingHorizontal: spacing.medium,
                backgroundColor: colors.white,
              },
            ]}
            textStyle={{ fontSize: Fonts.large }}
          />
          <View style={styles.category}>
            <TouchableOpacity
              onPress={() => setTab('info')}
              style={{
                flex: 1,
                borderColor:
                  onSelectedCategory === 'info' ? colors.blue : colors.Gray,
                borderBottomWidth: 2,
              }}
            >
              <Text style={[AppStyles.label, { textAlign: 'center' }]}>
                Thông tin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab('company')}
              style={{
                flex: 1,
                borderColor:
                  onSelectedCategory === 'company' ? colors.blue : colors.Gray,

                borderBottomWidth: 2,
              }}
            >
              <Text style={[AppStyles.label, { textAlign: 'center' }]}>
                Công ty
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={event => {
          const scrollY = event.nativeEvent.contentOffset.y;
          setShowFixedHeader(scrollY > ms(mainContent - fixedHeaderH + 20));
        }}
      >
        <View style={{ flex: 1 }}>
          <LinearGradient
            onLayout={e => setMainContent(e.nativeEvent.layout.height)}
            colors={['#095286', '#f5f5f5']} // Gradient từ xanh -> trắng
          >
            <NavBar
              onPress={() => navigation.goBack()}
              icon1={icons.more}
              customStyle={[{ paddingHorizontal: spacing.medium }]}
            />

            <View style={[styles.overview]}>
              <TouchableOpacity
                style={styles.companyLogo}
                onPress={() =>
                  navigate(Screen_Name.DetailCompany_Screen, { companyId })
                }
              >
                <Image
                  source={{
                    uri: jobDetails?.company?.coverUrl
                      ? `${link.url}${jobDetails.company.coverUrl}`
                      : 'default_image_url', // Fallback image if URL is missing
                  }}
                  style={{ width: ms(70), height: ms(70), borderRadius: 15 }}
                />
              </TouchableOpacity>
              <Text
                style={[
                  AppStyles.title,
                  { textAlign: 'center', marginBottom: spacing.small },
                ]}
              >
                {jobDetails.title}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigate(Screen_Name.DetailCompany_Screen, { companyId })
                }
              >
                <Text
                  style={[
                    AppStyles.label,
                    { textAlign: 'center', marginBottom: spacing.small },
                  ]}
                >
                  {jobDetails.company?.name}
                </Text>
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <View style={[styles.jobOverview]}>
                  <Image source={icons.salary} style={[AppStyles.icon]} />
                  <Text style={AppStyles.text}>Mức lương</Text>
                  <Text style={AppStyles.text}>{`${formatPriceToTy(
                    jobDetails.salaryFrom,
                  )} - ${formatPriceToTy(jobDetails.salaryTo)}`}</Text>
                </View>
                <View
                  style={{ borderLeftWidth: 1, borderColor: colors.Gray }}
                />
                <View style={[styles.jobOverview, { alignItems: 'center' }]}>
                  <Image source={icons.location} style={[AppStyles.icon]} />
                  <Text style={AppStyles.text}>Địa điểm</Text>
                  <Text style={AppStyles.text}>{jobDetails.provinceName}</Text>
                </View>
                <View
                  style={{ borderLeftWidth: 1, borderColor: colors.Gray }}
                />
                <View style={[styles.jobOverview, { alignItems: 'center' }]}>
                  <Image source={icons.exep} style={[AppStyles.icon]} />
                  <Text style={AppStyles.text}>Kinh nghiệm</Text>
                  <Text style={AppStyles.text}>
                    {`${jobDetails.experienceYear} ${
                      jobDetails.experienceYear > 1 ? 'years' : 'year'
                    }`}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.body}>
            <View style={styles.category}>
              <TouchableOpacity
                onPress={() => setTab('info')}
                style={{
                  flex: 1,
                  borderColor:
                    onSelectedCategory === 'info' ? colors.blue : colors.Gray,
                  borderBottomWidth: 2,
                }}
              >
                <Text style={[AppStyles.label, { textAlign: 'center' }]}>
                  Thông tin
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTab('company')}
                style={{
                  flex: 1,
                  borderColor:
                    onSelectedCategory === 'company'
                      ? colors.blue
                      : colors.Gray,

                  borderBottomWidth: 2,
                }}
              >
                <Text style={[AppStyles.label, { textAlign: 'center' }]}>
                  Công ty
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
              onPress={() => setOnSelectedCategory('competition')}
              style={{
                flex: 2,
                borderColor: colors.blue,
                borderBottomWidth: onSelectedCategory === 'competition' ? 1 : 0,
              }}
            >
              <Text style={[AppStyles.label, { textAlign: 'center' }]}>
                Mức độ cạnh tranh
              </Text>
            </TouchableOpacity> */}
            </View>
            <View style={styles.mainContent}>
              {onSelectedCategory === 'info' ? (
                <>
                  <View style={{ paddingHorizontal: spacing.medium }}>
                    <View style={styles.detailItem}>
                      <Text
                        style={[
                          AppStyles.title,
                          { marginBottom: spacing.small },
                        ]}
                      >
                        Description
                      </Text>
                      <Text style={AppStyles.text}>
                        {jobDetails.description}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text
                        style={[
                          AppStyles.title,
                          { marginBottom: spacing.small },
                        ]}
                      >
                        Requirement
                      </Text>
                      <Text style={AppStyles.text}>
                        {jobDetails.requirement}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text
                        style={[
                          AppStyles.title,
                          { marginBottom: spacing.small },
                        ]}
                      >
                        Benefit
                      </Text>
                      <Text style={AppStyles.text}>{jobDetails.benefit}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text
                        style={[
                          AppStyles.title,
                          { marginBottom: spacing.small },
                        ]}
                      >
                        Address
                      </Text>
                      <Text style={AppStyles.text}>{jobDetails.address}</Text>
                    </View>
                    <View
                      style={[
                        styles.detailItem,
                        { marginBottom: spacing.small },
                      ]}
                    >
                      <Text
                        style={[
                          AppStyles.title,
                          { marginBottom: spacing.small },
                        ]}
                      >
                        OverView
                      </Text>
                      <View style={styles.jobOverviewContainer}>
                        {jobOverview.map((item, index) => (
                          <View style={styles.jobOverviewItem} key={index}>
                            <Image
                              source={item.icon}
                              style={{ width: 40, height: 40 }}
                            />
                            <View
                              style={{
                                alignSelf: 'flex-start',
                                marginLeft: spacing.small,
                              }}
                            >
                              <Text
                                style={[AppStyles.text, { fontWeight: 'bold' }]}
                              >
                                {item.label}
                              </Text>
                              <Text style={[AppStyles.text]}>{item.value}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View style={[styles.detailItem]}>
                      <Text
                        style={[
                          AppStyles.title,
                          { marginBottom: spacing.small },
                        ]}
                      >
                        Requirement Skill
                      </Text>
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-evenly',
                          },
                        ]}
                      >
                        {jobDetails?.skills?.map((item, index) => (
                          <Text style={styles.skillsItem} key={index}>
                            {item}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>
                </>
              ) : onSelectedCategory === 'company' ? (
                <>
                  <View style={{ paddingHorizontal: spacing.medium }}>
                    {/* Company Name */}
                    <View style={styles.companyName}>
                      <TouchableOpacity
                        onPress={() =>
                          navigate(Screen_Name.DetailCompany_Screen, {
                            companyId,
                          })
                        }
                      >
                        <Text
                          style={[
                            AppStyles.title,
                            { marginBottom: spacing.small },
                          ]}
                        >
                          {jobDetails?.company?.name}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: spacing.medium,
                        }}
                      >
                        <Image
                          source={icons.location}
                          style={[AppStyles.icon]}
                        />
                        <View style={{ paddingHorizontal: spacing.medium }}>
                          <Text style={AppStyles.label}>Địa chỉ công ty</Text>
                          <Text style={[AppStyles.text, { flexWrap: 'wrap' }]}>
                            {jobDetails?.company?.address}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: spacing.medium,
                        }}
                      >
                        <Image
                          source={icons.internet}
                          style={[AppStyles.icon]}
                        />
                        <View style={{ paddingHorizontal: spacing.medium }}>
                          <Text style={AppStyles.label}>Website công ty</Text>
                          <TouchableOpacity
                            onPress={() =>
                              handleLinkPress(jobDetails?.company?.website)
                            }
                          >
                            <Text
                              style={[AppStyles.linkText, { flexWrap: 'wrap' }]}
                            >
                              {jobDetails?.company?.website}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Company Introduction */}
                    <View style={styles.companyIntroduction}>
                      <Text
                        style={[
                          AppStyles.title,
                          { marginBottom: spacing.small },
                        ]}
                      >
                        Company Introduction
                      </Text>
                      <Text style={AppStyles.text}>
                        {jobDetails?.company?.description}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <></> // Render nothing if it's neither 'info' nor 'company'
              )}
            </View>
          </View>
          <View style={styles.otherJob}>
            {onSelectedCategory === 'info' ? (
              <></>
            ) : onSelectedCategory === 'company' ? (
              <>
                <View style={styles.jobsOfCompany}>
                  <Text
                    style={[AppStyles.title, { marginBottom: spacing.small }]}
                  >
                    Jobs from the selected company:
                  </Text>
                  <FlatList
                    scrollEnabled={false}
                    data={filteredJobs.slice(0, 10)}
                    renderItem={renderJob}
                    keyExtractor={item => item.id.toString()}
                  />
                </View>
              </>
            ) : (
              <></>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.iconWrap}>
          <Image source={icons.heart} style={AppStyles.icon} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: spacing.medium,
            flex: 1,
          }}
        >
          <AppButton title="Apply Now" onPress={() => applyNow()} />
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
    </View>
  );
};

export default DetailJobScreen;
// ch
