import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  Button,
} from 'react-native';
import AppStyles from '../../../components/AppStyle';
import icons from '../../../assets/icons';
import { colors } from '../../../utils/color';
import { link } from '../../../utils/constants';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { ms, spacing } from '../../../utils/spacing';
import AppButton from '../../../components/AppButton';
import { followCompany } from '../../../services/company';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

type CardCompanyProps = {
  company: any;
  updateCompanyFollowed?: (companyId: string, isFollowed: boolean) => void;
  style?: ViewStyle;
};

const CardCompany: React.FC<CardCompanyProps> = ({
  company,
  updateCompanyFollowed,
  style,
}) => {
  const { t } = useTranslation();
  const token = useSelector((state: any) => state.user.token);
  const companyId = company?.id;
  const [isFollowing, setIsFollowing] = useState(company.isFollowing);

  useEffect(() => {
    setIsFollowing(company.isFollowing);
  }, [company.isFollowing]);

  const handleFollowCompany = async (companyId: string) => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: t('message.company_login'),
      });
    } else {
      const res = await followCompany(companyId);
      setIsFollowing(prev => !prev);
      if (typeof updateCompanyFollowed === 'function')
        updateCompanyFollowed(companyId, !isFollowing);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigate(Screen_Name.DetailCompany_Screen, {
            companyId,
          })
        }
        style={[styles.cardCompanyWrapper, style]}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{
              uri:
                company.logoUrl && /^https?:\/\//.test(company.logoUrl)
                  ? company.logoUrl
                  : `${link.url}${company.logoUrl}`,
            }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 15,
            }}
          />
          <View style={styles.rightContent}>
            <Text
              style={[
                AppStyles.title,
                {
                  // marginBottom: spacing.small,
                  flexWrap: 'wrap',
                },
              ]}
            >
              {company.name}
            </Text>
            <Text
              style={[
                AppStyles.text,
                { color: colors.Gray, marginBottom: spacing.small },
              ]}
            >
              {company.companyField}
            </Text>
            <View style={{ width: 'auto', alignSelf: 'flex-start' }}>
              <Text
                style={[
                  AppStyles.text,
                  {
                    backgroundColor: colors.lightGray,
                    paddingHorizontal: spacing.small,
                    paddingVertical: ms(2),
                    marginBottom: spacing.small,
                    justifyContent: 'center',
                    borderRadius: 5,
                  },
                ]}
              >
                {`${
                  company.jobs?.length > 1
                    ? `${company.jobs?.length} ${t('label.jobs')}`
                    : `${company.jobs?.length} ${t('label.job')}`
                }`}
              </Text>
            </View>

            <AppButton
              title={isFollowing ? t('button.following') : t('button.follow')}
              leftIcon={isFollowing ? icons.checked : icons.add}
              onPress={() => handleFollowCompany(companyId)}
              customStyle={{
                paddingVertical: ms(8),
                backgroundColor: colors.background,
                borderColor: colors.primary,
                borderWidth: 0.5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              iconStyle={{
                backgroundColor: colors.background,
                tintColor: colors.primary,
              }}
              textStyle={{ color: colors.primary }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: spacing.medium },
  cardCompanyWrapper: {
    flex: 1,
    // height: ms(200),
    borderRadius: 15,
    borderColor: colors.Gray,
    borderWidth: 0.5,
    padding: spacing.medium,
    marginHorizontal: spacing.medium,
  },
  rightContent: {
    width: '75%',
    marginLeft: spacing.medium,
  },
});

export default CardCompany;
