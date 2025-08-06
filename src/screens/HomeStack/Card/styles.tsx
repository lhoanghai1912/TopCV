import { StyleSheet } from 'react-native';
import { colors } from '../../../utils/color';
import { ms, spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    marginHorizontal: spacing.medium,
    padding: spacing.medium,
    borderRadius: 15,
    borderWidth: 1,
    height: ms(180),
    justifyContent: 'center',
    borderColor: colors.blue,
    backgroundColor: '#c4d7e6ff',
    flexDirection: 'column', // Ensure column direction for proper stacking
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
    borderRadius: 15,
  },
  jobInfo: { paddingLeft: spacing.small, flex: 1 },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInfo: {
    backgroundColor: '#E4E5E7',
    padding: spacing.small,
    borderRadius: 20,
    fontSize: Fonts.normal,
  },
  iconWrap: {
    borderRadius: 100,
    padding: ms(5),
    borderWidth: 1,
    borderColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
