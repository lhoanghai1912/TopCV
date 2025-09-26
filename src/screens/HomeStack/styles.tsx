import { StyleSheet } from 'react-native';
import { ms, spacing } from '../../utils/spacing';
import { Fonts } from '../../utils/fontSize';
import { colors } from '../../utils/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: spacing.medium,
    justifyContent: 'flex-end',
    marginBottom: spacing.medium,
  },
  search: {
    borderRadius: 20,
    paddingHorizontal: spacing.medium,
    // paddingVertical: spacing.small,
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    height: ms(50),
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.small,
  },
  body: {
    marginBottom: spacing.medium,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: Fonts.normal,
  },
  footerLoader: {
    paddingVertical: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Fonts.normal,
    color: '#666',
  },
  noMoreText: {
    fontSize: Fonts.normal,
    color: '#999',
    fontStyle: 'italic',
  },
  iconWrap: {
    borderRadius: 50,
    borderWidth: 1,
    padding: ms(5),
    borderColor: colors.Gray,
    justifyContent: 'center',
  },
});
export default styles;
