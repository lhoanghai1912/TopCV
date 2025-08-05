import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../utils/color';
import { ms, spacing } from '../../utils/spacing';
import images from '../../assets/images';
import AppStyles from '../../components/AppStyle';

const Card = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <View style={styles.mainContent}>
          <Image
            // source={images.company_logo}
            style={styles.companyImage}
          />
          <View style={styles.jobInfo}>
            <Text style={AppStyles.title}>
              TitleTitleTitleTitleTitleTitleTit
            </Text>
            <Text style={AppStyles.text}>
              TextTextTextTextTextTextTextTextTextText
            </Text>
          </View>
        </View>
        <View style={styles.optional}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    marginHorizontal: spacing.medium,
    padding: spacing.medium,
    borderRadius: 15,
    borderWidth: 1,
    height: ms(150),
    borderColor: colors.blue,
  },
  mainContent: {
    marginBottom: spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    backgroundColor: colors.red,
  },
  jobInfo: { paddingLeft: spacing.small },
  optional: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blue,
    flex: 1,
  },
});

export default Card;
