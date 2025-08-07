import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJobDetails, getJobofCompany } from '../../../services/job';
import NavBar from '../../../components/Navbar';
import icons from '../../../assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { link } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import { ms, spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';
import { formatPriceToTy } from '../../../components/formatPrice';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Fonts } from '../../../utils/fontSize';
import moment from 'moment';
import Card from '../Card';
import AppButton from '../../../components/AppButton';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
interface Props {
  navigation: any;
  route: any;
}

const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  console.log('job id: ', route.params.job.id);
  const { token } = useSelector((state: any) => state.user);
  const [jobDetails, setJobDetails] = useState<any>([]);
  const [listJobsOfCompany, setListJobsOfCompany] = useState<any>([]);
  const [onSelectedCategory, setOnSelectedCategory] = useState('info');
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<any>([]);

  const jobOverview = [
    {
      icon: icons.apple,
      label: 'Hạn ứng tuyển',
      value: moment(jobDetails.applicationDeadline).format('DD/MM/YYYY'),
    },
    { icon: icons.apple, label: 'Cấp bậc', value: jobDetails.jobLevel },

    {
      icon: icons.apple,
      label: 'Trình độ giáo dục',
      value: jobDetails.educationLevel,
    },
    {
      icon: icons.apple,
      label: 'Số lượng ứng tuyển',
      value: jobDetails.numberOfVacancies,
    },
    {
      icon: icons.apple,
      label: 'Hình thức làm việc',
      value: jobDetails.jobType,
    },
  ];
  useEffect(() => {
    fetchJobDetails();
  }, [route.params.job.id]);

  useEffect(() => {
    if (jobDetails?.company?.id) {
      fetchJobOfCompany();
    }
  }, [jobDetails]);

  useEffect(() => {
    // Lọc công việc có id khác với currentJob.id
    const filtered = listJobsOfCompany?.filter(job => job.id !== jobDetails.id);
    setFilteredJobs(filtered);
  }, [listJobsOfCompany, jobDetails]);

  const fetchJobDetails = async () => {
    const data = await getJobDetails(route.params.job.id);
    setJobDetails(data);
    console.log('data', data);
  };

  const fetchJobOfCompany = async () => {
    const data = await getJobofCompany(jobDetails?.company?.id);
    setListJobsOfCompany(data);
    console.log('job of company', data);
  };

  const handleLinkPress = link => {
    Linking.openURL(link).catch(err =>
      console.error('Failed to open URL', err),
    );
  };

  const renderJob = ({ item }: any) => {
    return (
      <>
        <Card
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
        <View style={styles.fixedHeader}>
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
              onPress={() => setOnSelectedCategory('info')}
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
              onPress={() => setOnSelectedCategory('company')}
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
        style={[styles.container]}
        scrollEventThrottle={16}
        onScroll={event => {
          const scrollY = event.nativeEvent.contentOffset.y;
          setShowFixedHeader(scrollY > ms(260));
        }}
      >
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={['#095286', '#f5f5f5']} // Gradient từ xanh -> trắng
          >
            <NavBar
              onPress={() => navigation.goBack()}
              icon1={icons.more}
              customStyle={[{ paddingHorizontal: spacing.medium }]}
            />

            <View style={[styles.overview]}>
              <Image
                source={{
                  uri: jobDetails?.company?.coverUrl
                    ? `${link.url}${jobDetails.company.coverUrl}`
                    : 'default_image_url', // Fallback image if URL is missing
                }}
                style={styles.companyLogo}
              />
              <Text
                style={[
                  AppStyles.title,
                  { textAlign: 'center', marginBottom: spacing.small },
                ]}
              >
                {jobDetails.title}
              </Text>
              <Text
                style={[
                  AppStyles.label,
                  { textAlign: 'center', marginBottom: spacing.small },
                ]}
              >
                {jobDetails.company?.name}
              </Text>
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
                onPress={() => setOnSelectedCategory('info')}
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
                onPress={() => setOnSelectedCategory('company')}
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
                            <Image source={item.icon} style={AppStyles.icon} />
                            <View
                              style={{
                                alignSelf: 'flex-start',
                                marginLeft: spacing.small,
                              }}
                            >
                              <Text style={[AppStyles.text]}>{item.label}</Text>
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
                      <Text
                        style={[
                          AppStyles.title,
                          { marginBottom: spacing.small },
                        ]}
                      >
                        {jobDetails?.company?.name}
                      </Text>
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
                            {jobDetails.company.address}
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
                    data={filteredJobs}
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
        <View style={styles.iconWrap}>
          <Image source={icons.heart} style={AppStyles.icon} />
        </View>
        <View
          style={{
            // backgroundColor: 'red',
            marginLeft: spacing.medium,
            flex: 1,
          }}
        >
          <AppButton title="Apply Now" onPress={() => applyNow()} />
        </View>
      </View>
    </View>
  );
};

export default DetailsScreen;
