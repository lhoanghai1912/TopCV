import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJobDetails } from '../../../services/job';
import NavBar from '../../../components/Navbar';
import icons from '../../../assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { link } from '../../../utils/constants';
import AppStyles from '../../../components/AppStyle';
import { ms, spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';
import { formatPriceToTy } from '../../../components/formatPrice';
import { ScrollView } from 'react-native-gesture-handler';
interface Props {
  navigation: any;
  route: any;
}

const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  console.log('job id: ', route.params.job.id);
  const [jobDetails, setJobDetails] = useState<any>([]);
  const [onSelectedCategory, setOnSelectedCategory] = useState('info');
  useEffect(() => {
    fetchJobDetails();
  }, [route.params.job.id]);
  const fetchJobDetails = async () => {
    const data = await getJobDetails(route.params.job.id);
    setJobDetails(data);
    console.log('data', data);
  };
  console.log('detail', jobDetails);
  // console.log('uri', `${link.url}${jobDetails.company?.coverUrl}`);

  return (
    <ScrollView style={[styles.container]}>
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
              <View style={{ borderLeftWidth: 1, borderColor: colors.Gray }} />
              <View style={[styles.jobOverview, { alignItems: 'center' }]}>
                <Image source={icons.location} style={[AppStyles.icon]} />
                <Text style={AppStyles.text}>Địa điểm</Text>
                <Text style={AppStyles.text}>{jobDetails.provinceName}</Text>
              </View>
              <View style={{ borderLeftWidth: 1, borderColor: colors.Gray }} />
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
                  onSelectedCategory === 'company' ? colors.blue : colors.Gray,

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
                    <Text style={AppStyles.title}>Description</Text>
                    <Text>{jobDetails.description}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={AppStyles.title}>Requirement</Text>
                    <Text>{jobDetails.requirement}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={AppStyles.title}>Benefit</Text>
                    <Text>{jobDetails.benefit}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={AppStyles.title}>Address</Text>
                    <Text>{jobDetails.address}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={AppStyles.title}>OverView</Text>
                    <View style={{}}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}
                      >
                        <Image source={icons.apple} style={AppStyles.icon} />
                        <View>
                          <Text
                            style={[AppStyles.text, { color: colors.Gray }]}
                          >
                            Application Deadline
                          </Text>
                          <Text>{jobDetails.applicationDeadline}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}
                      >
                        <Image source={icons.apple} style={AppStyles.icon} />
                        <View>
                          <Text
                            style={[AppStyles.text, { color: colors.Gray }]}
                          >
                            Job Level
                          </Text>
                          <Text>{jobDetails.jobLevel}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}
                      >
                        <Image source={icons.apple} style={AppStyles.icon} />
                        <View>
                          <Text
                            style={[AppStyles.text, { color: colors.Gray }]}
                          >
                            Gender Requirement
                          </Text>
                          <Text>{jobDetails.genderRequirement}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}
                      >
                        <Image source={icons.apple} style={AppStyles.icon} />
                        <View>
                          <Text
                            style={[AppStyles.text, { color: colors.Gray }]}
                          >
                            Education Level
                          </Text>
                          <Text>{jobDetails.educationLevel}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}
                      >
                        <Image source={icons.apple} style={AppStyles.icon} />
                        <View>
                          <Text
                            style={[AppStyles.text, { color: colors.Gray }]}
                          >
                            Number Of Vacancies
                          </Text>
                          <Text>{jobDetails.numberOfVacancies}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ) : onSelectedCategory === 'company' ? (
              <Text>company</Text>
            ) : (
              <></> // Render nothing if it's neither 'info' nor 'company'
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;
