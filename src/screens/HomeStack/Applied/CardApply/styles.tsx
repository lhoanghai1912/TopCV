import { StyleSheet } from 'react-native';
import { colors } from '../../../../utils/color';
import { ms, spacing } from '../../../../utils/spacing';
import { Fonts } from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: spacing.medium,
  },
  cardJobWrapper: {
    marginHorizontal: spacing.medium,
    padding: spacing.medium,
    borderRadius: ms(15),
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: colors.Gray,
    flexDirection: 'column', // Ensure column direction for proper stacking
    backgroundColor: colors.white,
  },
  mainContent: {
    marginBottom: spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyImage: {
    width: ms(80),
    height: ms(80),
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: ms(15),
  },
  appliedInfo: { paddingLeft: spacing.small, flex: 1 },
  description: {},
  description_item: {
    marginBottom: spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInfo: {
    backgroundColor: '#E4E5E7',
    padding: spacing.small,
    borderRadius: ms(20),
    fontSize: Fonts.normal,
  },
  icon: {
    width: ms(20),
    height: ms(20),
    marginRight: spacing.small,
  },
  iconWrap: {
    borderRadius: ms(100),
    padding: ms(5),
    borderWidth: 1,
    borderColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
