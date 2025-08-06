import { StyleSheet } from 'react-native';
import { ms, spacing } from '../../utils/spacing';

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
export default styles;
