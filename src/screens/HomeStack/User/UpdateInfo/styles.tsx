import { StyleSheet } from 'react-native';
import { ms, spacing } from '../../../../utils/spacing';
import { Fonts } from '../../../../utils/fontSize';
import { colors } from '../../../../utils/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
  },
  title: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
    marginBottom: spacing.large,
    textAlign: 'center',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: spacing.large,
  },
  avatar: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
  },
  avatarPlaceholder: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    fontSize: Fonts.normal,
  },
});

export default styles;
