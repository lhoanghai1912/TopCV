import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, spacing } from '../../utils/spacing';
import LinearGradient from 'react-native-linear-gradient';
import icons from '../../assets/icons';
import AppStyles from '../../components/AppStyle';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Card from './Card';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const token = useSelector((state: any) => state.user.token);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#095286', '#f5f5f5']} // Gradient từ xanh -> trắng
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <TouchableOpacity onPress={() => {}} style={styles.search}>
          <Image
            source={icons.search}
            style={[AppStyles.icon, { marginRight: spacing.small }]}
          />
          <Text style={AppStyles.text}>{t('message.find')}</Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.category}></View>
      <View style={styles.body}>
        <Card />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: spacing.medium,
    height: ms(120), // Đặt chiều cao cho header, bạn có thể thay đổi theo nhu cầu
    justifyContent: 'flex-end',
    marginBottom: spacing.medium,
  },
  search: {
    borderRadius: 20,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    height: ms(50),
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  body: {
    marginBottom: spacing.medium,
  },
  text: {
    fontSize: 24,
  },
});

export default HomeScreen;
