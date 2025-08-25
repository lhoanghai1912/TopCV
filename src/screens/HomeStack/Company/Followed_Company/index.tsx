import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, spacing } from '../../../../utils/spacing';
import NavBar from '../../../../components/Navbar';
import { FlatList } from 'react-native-gesture-handler';
import { colors } from '../../../../utils/color';
import AppStyles from '../../../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import CardCompany from '../CardCompany';
import { getFollowedCompanies } from '../../../../services/company';
import { useFocusEffect } from '@react-navigation/native';
interface Props {
  navigation: any;
  route: any;
}

const FollowedCompanyScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [listFollowedCompanies, setListFollowedCompanies] = React.useState<any>(
    [],
  );
  const updateCompanyFollowed = (id: number, isFollowing: boolean) => {
    if (!isFollowing) {
      setListFollowedCompanies(prev =>
        prev.filter(company => company.id !== id),
      );
    } else {
      setListFollowedCompanies(prev =>
        prev.map(company =>
          company.id === id ? { ...company, isFollowing } : company,
        ),
      );
    }
  };
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      fetchListFollowedCompanies();
    }, []),
  );
  const fetchListFollowedCompanies = async () => {
    const res = await getFollowedCompanies();
    setListFollowedCompanies(res.companies);
    console.log('list followed companies', res);
  };
  const renderFollowedCompany = ({ item }: { item: any }) => {
    return (
      <View>
        <CardCompany
          company={item}
          updateCompanyFollowed={(id, isFollowing) =>
            updateCompanyFollowed(Number(id), isFollowing)
          }
        />
      </View>
    );
  };
  console.log('data', listFollowedCompanies);

  return (
    <View style={[styles.container]}>
      <NavBar
        title={t('label.company_followed')}
        onPress={() => {
          navigation.goBack();
        }}
        customStyle={{
          marginBottom: spacing.medium,
          backgroundColor: colors.white,
          paddingTop: ms(50 + insets.top),
        }}
      />
      <View>
        <View>
          <Text
            style={[
              AppStyles.title,
              {
                paddingLeft: spacing.medium,
                marginBottom: spacing.small,
                display: listFollowedCompanies?.length ? 'flex' : 'none',
              },
            ]}
          >{`${
            listFollowedCompanies.length > 1
              ? `${listFollowedCompanies.length} ${t(
                  `message.companies_followed`,
                )}`
              : `${listFollowedCompanies.length} ${t(
                  `message.company_followed`,
                )}`
          }`}</Text>
        </View>
        <FlatList
          data={listFollowedCompanies}
          keyExtractor={item => item.id}
          renderItem={renderFollowedCompany}
          style={{ marginBottom: ms(180) }}
          ListEmptyComponent={() => (
            <>
              <View style={{ alignItems: 'center', marginTop: spacing.medium }}>
                <Text style={AppStyles.title}>
                  {t(`message.company_followed_none`)}
                </Text>
              </View>
            </>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FollowedCompanyScreen;
