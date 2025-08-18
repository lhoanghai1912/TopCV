import { StyleSheet } from 'react-native';
import { spacing } from '../../../../utils/spacing';
import { Fonts } from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: spacing.large,
  },
  title: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
    marginBottom: spacing.large,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    fontSize: Fonts.normal,
    backgroundColor: '#F7F7F7',
  },
  error: {
    color: '#E53935',
    fontSize: Fonts.normal,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
});

export default styles;
