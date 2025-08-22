import { StyleSheet } from 'react-native';
import { ms, spacing } from '../../../../utils/spacing';
import { colors } from '../../../../utils/color';
import { Fonts } from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imageContainer: {
    height: ms(200), // You can adjust the height of the background image
  },
  imageBackground: {
    flex: 1,
  },
  companyLogo: {
    resizeMode: 'cover',
    width: ms(70),
    height: ms(70),
    borderRadius: 15,
    position: 'absolute',
    top: ms(-35),
    alignSelf: 'center',
  },
  customIcon: {
    backgroundColor: colors.white,
    borderRadius: 50,
    borderColor: colors.Gray,
    borderWidth: 0.5,
  },
  overview: {
    height: ms(250),
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingTop: ms(51),
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.medium,
    marginHorizontal: spacing.medium,
  },
  overlayContent: {
    position: 'absolute',
    bottom: ms(20),
    left: ms(20),
    right: ms(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better readability
    padding: ms(10),
    borderRadius: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  fixedHeader: {
    paddingTop: spacing.medium,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    backgroundColor: colors.white,
  },
  fixedHeaderText: {
    fontSize: 18,
    color: 'white',
  },
  companyDetailsContainer: {
    padding: ms(20),
  },
  companyDescription: {
    fontSize: 16,
    color: '#333',
  },
  category: {
    flexDirection: 'row',
    paddingHorizontal: spacing.medium,
  },
  mainContent: { marginBottom: spacing.medium, paddingTop: spacing.medium },
  label: {
    fontSize: Fonts.large,
    fontWeight: '500',
    marginBottom: spacing.small,
  },
  other: {
    backgroundColor: colors.background,
    paddingTop: spacing.medium,
  },
  categoryFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  tabItem: {
    flex: 1,
    paddingHorizontal: spacing.medium,
    paddingVertical: ms(8),
    borderBottomWidth: 2,
  },
});

export default styles;
