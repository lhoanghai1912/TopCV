import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import images from '../../../../assets/images';
import { spacing } from '../../../../utils/spacing';
import { navigate } from '../../../../navigation/RootNavigator';
import { Screen_Name } from '../../../../navigation/ScreenName';
import AppStyles from '../../../../components/AppStyle';
import { link } from '../../../../utils/constants';
type CardCVProps = {
  cv: any;
};
const CardCV: React.FC<CardCVProps> = ({ cv }: CardCVProps) => {
  const cvId = cv?.id;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log('cvId', cvId), navigate(Screen_Name.DetailCV, { cvId });
        }}
        style={styles.cardCV}
      >
        <View style={styles.images}>
          <Image
            source={
              cv?.photoCard
                ? { uri: `${link.url}${cv?.photoCard}` }
                : images.avt_default
            }
            style={styles.images}
          />
        </View>
        <View style={styles.cvContent}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[AppStyles.label]}
          >
            {cv?.name}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[AppStyles.label]}
          >
            {cv?.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.medium,
  },
  cardCV: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: spacing.medium,
    padding: spacing.small,
    width: '100%',
  },
  images: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    borderRadius: 15,
  },
  cvContent: {
    marginLeft: spacing.small,
    justifyContent: 'space-evenly',
    paddingHorizontal: spacing.small,
    width: '70%',
  },
});

export default CardCV;
