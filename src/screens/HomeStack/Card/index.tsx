import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AppStyles from '../../../components/AppStyle';
import styles from './styles';
import icons from '../../../assets/icons';
import images from '../../../assets/images';
import { colors } from '../../../utils/color';
import { link } from '../../../utils/constants';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../../navigation/RootNavigator';
import { Screen_Name } from '../../../navigation/ScreenName';

type CardProps = {
  job: any;
  onReload?: () => void;
};

const Card: React.FC<CardProps> = ({ job, onReload }) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const formatPriceToTy = (price: number): string => {
    if (!price || isNaN(price)) return t('price.deal');

    if (price >= 1_000_000_000) {
      const billion = price / 1_000_000_000;
      return billion % 1 === 0
        ? `${billion.toFixed(0)} ${t('price.bilion')}` // Hiển thị số nguyên nếu chia hết
        : `${billion.toFixed(2)} ${t('price.bilion')}`; // Hiển thị 2 chữ số thập phân nếu không chia hết
    }

    if (price >= 1_000_000) {
      const million = price / 1_000_000;
      return million % 1 === 0
        ? `${million.toFixed(0)} ${t('price.milion')}`
        : `${million.toFixed(2)} ${t('price.milion')}`;
    }

    if (price >= 1_000) {
      const thousand = price / 1_000;
      return thousand % 1 === 0
        ? `${thousand.toFixed(0)} ${t('price.thousand')}`
        : `${thousand.toFixed(2)} ${t('price.thousand')}`;
    }
    if (price === 0) {
      return `${t('price.deal')}`;
    }
    return `${price.toFixed(0)} `; // Trả về giá trị nếu không thuộc các loại trên
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigate(Screen_Name.Details_Screen)}
        style={styles.cardWrapper}
      >
        <View style={styles.mainContent}>
          <Image
            source={{ uri: `${link.url}${job.companyLogoUrl}` }}
            style={styles.companyImage}
          />
          <View style={styles.jobInfo}>
            <Text style={[AppStyles.title]} numberOfLines={2}>
              {job.title}
            </Text>
            <Text style={[AppStyles.text]} numberOfLines={1}>
              {job.companyName}
            </Text>
          </View>
        </View>
        <View style={styles.description}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '70%',
            }}
          >
            <Text style={styles.textInfo}>{`${formatPriceToTy(
              job.salaryFrom,
            )} - ${formatPriceToTy(job.salaryTo)}`}</Text>
            <Text style={styles.textInfo}>{job.location || 'abc'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.iconWrap]}
            onPress={() => setLiked(!liked)}
          >
            <Image
              source={liked ? icons.heart_like : icons.heart}
              style={[AppStyles.icon]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;
