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
import images from '../../../assets/images';
import { colors } from '../../../utils/color';
import { link } from '../../../utils/constants';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';
import { formatPriceToTy } from '../../../components/formatPrice';
import { ms, spacing } from '../../../utils/spacing';
import AppButton from '../../../components/AppButton';

type CardCompanyProps = {
  company: any;
  onReload?: () => void;
  style?: ViewStyle;
};

const CardCompany: React.FC<CardCompanyProps> = ({
  company,
  onReload,
  style,
}) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const companyId = company?.id;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigate(Screen_Name.DetailCompany_Screen, { companyId })
        }
        style={[styles.cardCompanyWrapper, style]}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: `${link.url}${company.logoUrl}` }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 15,
              backgroundColor: colors.red,
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
              Category
            </Text>
            <Text
              style={[
                AppStyles.text,
                {
                  backgroundColor: colors.Gray,
                  paddingHorizontal: spacing.small,
                  marginBottom: spacing.small,
                },
              ]}
            >
              số lượng việc làm
            </Text>
            <AppButton
              title="Theo dõi"
              leftIcon={icons.add}
              onPress={() => {}}
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
                tintColor: undefined,
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
