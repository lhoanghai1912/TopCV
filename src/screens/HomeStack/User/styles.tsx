import { StyleSheet } from 'react-native';
import { colors } from '../../../utils/color';
import { spacing } from '../../../utils/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    backgroundColor: colors.white,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
    paddingBottom: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.Gray,
    justifyContent: 'space-between',
  },
});

export default styles;
