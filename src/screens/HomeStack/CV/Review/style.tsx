import { StyleSheet } from 'react-native';
import { ms, spacing } from '../../../../utils/spacing';
import { Fonts } from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  title: {
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  infoBlock: {
    flexDirection: 'row',
    marginBottom: spacing.small,
    paddingHorizontal: spacing.medium,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: spacing.medium,
    width: ms(120),
  },
  value: {
    fontSize: spacing.medium,
    flex: 1,
    color: '#333',
  },
  detailsBlock: {
    marginTop: spacing.medium,
  },
});

export default styles;
