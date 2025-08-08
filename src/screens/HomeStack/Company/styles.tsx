import { StyleSheet } from 'react-native';
import { ms, spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';
import { colors } from '../../../utils/color';

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
    paddingHorizontal: spacing.medium,
  },
  body: {
    paddingBottom: ms(150),
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
