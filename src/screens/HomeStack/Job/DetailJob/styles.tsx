import { StyleSheet } from 'react-native';
import { ms, spacing } from '../../../../utils/spacing';
import { colors } from '../../../../utils/color';
import { Fonts } from '../../../../utils/fontSize';

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginBottom: spacing.medium,
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
  companyLogo: {
    resizeMode: 'cover',

    position: 'absolute',
    top: ms(-35),
    alignSelf: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    backgroundColor: colors.white,
    paddingTop: spacing.medium,
    marginBottom: spacing.medium,
  },
  jobOverview: {
    alignItems: 'center',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
    borderColor: colors.Gray,
  },
  detailItem: { marginBottom: spacing.medium },
  requirement: {},
  benefit: {},
  mainContent: {},
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    backgroundColor: colors.white,
  },
  jobOverviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  jobOverviewItem: {
    flexDirection: 'row',
    width: '48%', // Make each item take 48% of the row's width
    marginBottom: spacing.small,
    alignItems: 'center',
  },
  skillsItem: {
    backgroundColor: colors.Gray,
    padding: spacing.small,
    borderRadius: 20,
    marginBottom: spacing.small,
    fontSize: Fonts.normal,
  },
  otherJob: { backgroundColor: colors.default },
  companyName: {},
  companyIntroduction: { marginBottom: spacing.medium },
  jobsOfCompany: {
    backgroundColor: colors.default,
    paddingHorizontal: spacing.medium,
  },
  footer: {
    paddingTop: spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.medium,
    justifyContent: 'space-between',
  },
  iconWrap: {
    borderRadius: 10,
    borderWidth: 1,
    padding: ms(5),
    borderColor: colors.Gray,
  },
});
export default styles;
