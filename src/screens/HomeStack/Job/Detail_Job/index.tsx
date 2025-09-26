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
import {
  getJobDetails,
  getJobofCompany,
  patchSavedJob,
} from '../../../../services/job';
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
import { useTranslation } from 'react-i18next';
import ModalApply from '../../../../components/modal/ModalApply';
interface Props {
  navigation: any;
  route: any;
}

const DetailJobScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { token } = useSelector((state: any) => state.user);
  const [jobDetails, setJobDetails] = useState<any>([]);
  const [listJobsOfCompany, setListJobsOfCompany] = useState<any>([]);
  const [onSelectedCategory, setOnSelectedCategory] = useState('info');
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [modalApply, setModalApply] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const companyId = jobDetails?.company?.id;
  const jobId = route.params?.job?.id || route.params?.applied?.jobId;

  const scrollRef = React.useRef<ScrollView>(null);
  const [mainTop, setMainTop] = useState(0);
  const [fixedHeaderH, setFixedHeaderH] = useState(0);
  const [mainContent, setMainContent] = useState(0);
  const [isSaved, setIsSaved] = useState(route.params?.job?.isSaved);

  const jobOverview = [
    {
      icon: icons.apple,
      label: t('label.job_app_deadline'),
      value: moment(jobDetails.applicationDeadline).format('DD/MM/YYYY'),
    },
    {
      icon: icons.apple,
      label: t('label.job_level'),
      value: jobDetails.jobLevelName,
    },

    {
      icon: icons.apple,
      label: t('label.job_edu_level'),
      value: jobDetails.educationLevelName,
    },
    {
      icon: icons.apple,
      label: t('label.job_num_vacancies'),
      value: jobDetails.numberOfVacancies,
    },
    {
      icon: icons.apple,
      label: t('label.job_type'),
      value: jobDetails.jobTypeName,
    },
  ];
  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

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

  const handleSaveJob = async () => {
    if (token) {
      try {
        const res = await patchSavedJob(jobId);
        console.log(res);

        Toast.show({
          type: 'success',
          text1: 'Thông báo',
          text2: `${
            res.isSaved === true
              ? t('message.job_saved_success')
              : t('message.job_unsaved_success')
          } `,
          visibilityTime: 1500,
        });
        setIsSaved(!isSaved);
      } catch (error) {}
    }
  };

  const scrollToMain = () => {
    // Scroll đến vị trí fixedHeaderH (đầu header mới)
    scrollRef.current?.scrollTo({
      y: ms(mainTop - 80),
      animated: true,
    });
  };

  const setTab = (key: 'info' | 'company') => {
    setOnSelectedCategory(key);
    requestAnimationFrame(scrollToMain); // Prevent jitter when scrolling
  };
  const renderJob = ({ item }: any) => {
    return (
      <>
        <CardJob job={item} />
        <View style={{ marginBottom: spacing.medium }} />
      </>
    );
  };

  const applyNow = () => {
    if (!token) {
      Toast.show({
        type: 'error',
        text2: 'Cần đăng nhập để thực hiện tính năng này',
        visibilityTime: 1500,
      });
    } else {
      setModalApply(true);
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
            customStyle={{
              paddingHorizontal: spacing.medium,
              backgroundColor: colors.white,
            }}
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
                {t('label.info')}
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
                {t('label.company')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={event => {
          const y = event.nativeEvent.contentOffset.y;
          setShowFixedHeader(y > ms(mainTop - 80));
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
              iconStyle={{}}
              customStyle={{
                paddingHorizontal: spacing.medium,
              }}
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
                    uri:
                      jobDetails?.company?.logoUrl &&
                      /^https?:\/\//.test(jobDetails.company.logoUrl)
                        ? jobDetails.company.logoUrl
                        : jobDetails?.company?.logoUrl
                        ? `${link.url}${jobDetails.company.logoUrl}`
                        : 'default_image_url',
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
                    {
                      fontSize: Fonts.xlarge,
                      textAlign: 'center',
                      marginBottom: spacing.small,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  {jobDetails.company?.name}
                </Text>
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <View style={[styles.jobOverview]}>
                  <Image source={icons.salary} style={[AppStyles.icon]} />
                  <Text style={AppStyles.text}>{t('label.salary')}</Text>
                  <Text style={AppStyles.text}>{`${formatPriceToTy(
                    jobDetails.salaryFrom,
                  )} - ${formatPriceToTy(jobDetails.salaryTo)}`}</Text>
                </View>
                <View
                  style={{ borderLeftWidth: 1, borderColor: colors.Gray }}
                />
                <View style={[styles.jobOverview, { alignItems: 'center' }]}>
                  <Image source={icons.location} style={[AppStyles.icon]} />
                  <Text style={AppStyles.text}>{t('label.location')}</Text>
                  <Text style={AppStyles.text}>{jobDetails.provinceName}</Text>
                </View>
                <View
                  style={{ borderLeftWidth: 1, borderColor: colors.Gray }}
                />
                <View style={[styles.jobOverview, { alignItems: 'center' }]}>
                  <Image source={icons.exep} style={[AppStyles.icon]} />
                  <Text style={AppStyles.text}>{t('label.experience')}</Text>
                  <Text style={AppStyles.text}>
                    {`${jobDetails.experienceYear} ${
                      jobDetails.experienceYear > 1 ? 'years' : 'year'
                    }`}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View
            style={styles.body}
            onLayout={e => {
              // Gán mainTop là vị trí y của viewCategory khi không có fixedHeader
              if (!showFixedHeader) {
                setMainTop(e.nativeEvent.layout.y);
              }
            }}
          >
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
                  {t('label.info')}
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
                  {t('label.company')}
                </Text>
              </TouchableOpacity>
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
                        {t('label.description')}
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
                        {t('label.requirement')}
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
                        {t('label.benefit')}
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
                        {t('label.address')}
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
                        {t('label.overview')}
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
                        {t('label.requirement_skill')}
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
                          <Text style={AppStyles.label}>
                            {t('label.company_address')}
                          </Text>
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
                          <Text style={AppStyles.label}>
                            {t('label.company_website')}
                          </Text>
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
                        {t('label.company_introduction')}
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
                    {t('label.job_of_company')}
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
        <TouchableOpacity
          style={styles.iconWrap}
          onPress={() => handleSaveJob()}
        >
          <Image
            source={isSaved ? icons.heart_like : icons.heart}
            style={AppStyles.icon}
          />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: spacing.medium,
            flex: 1,
          }}
        >
          <AppButton title={t('button.apply_now')} onPress={() => applyNow()} />
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
      <ModalApply
        visible={modalApply}
        onClose={() => setModalApply(false)}
        jobDetails={jobDetails}
      />
    </View>
  );
};

export default DetailJobScreen;
