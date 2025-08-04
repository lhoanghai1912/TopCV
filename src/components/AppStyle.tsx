import { StyleSheet } from 'react-native';
import { Fonts } from '../utils/fontSize';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';

const AppStyles = StyleSheet.create({
  title: {
    fontSize: Fonts.xlarge,
    color: colors.black,
    textAlign: 'center',
    fontWeight: 500,
    marginBottom: spacing.medium,
  },
  label: {
    fontSize: Fonts.large,
    marginBottom: spacing.small,
    color: '#333',
  },
  line: {
    borderColor: colors.Gray,
    borderWidth: 0.5,
    width: '100%',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: spacing.medium,
    verticalAlign: 'middle',
    fontSize: Fonts.normal,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: spacing.medium,
  },
  disable: {
    opacity: 0.5,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: spacing.medium,
    verticalAlign: 'middle',
    fontSize: Fonts.normal,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: spacing.medium,
  },
  avartar: {
    width: 100,
    height: 100,
    borderRadius: 500,
  },
  text: {
    fontSize: Fonts.normal,
  },
  whitetext: {
    fontSize: Fonts.normal,
    color: colors.white,
  },

  icon: { width: 35, height: 35 },

  iconSingle: {
    width: 30,
    flexDirection: 'row',
    position: 'absolute',
    resizeMode: 'contain',
    right: spacing.small,
    top: '20%',
    justifyContent: 'space-between',
  },

  iconGroup: {
    width: 60,
    flexDirection: 'row',
    position: 'absolute',
    resizeMode: 'contain',
    top: '20%',
    justifyContent: 'space-between',
    right: spacing.small,
  },

  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.medium,
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.medium,
  },
  scrollContent: {
    paddingBottom: spacing.large, // Đảm bảo có đủ không gian khi cuộn
  },
  dropdownWrapper: {
    position: 'relative', // Quan trọng để định vị dropdown tuyệt đối bên trong
  },
  dropdown: {
    position: 'absolute',
    top: 90, // Tùy chỉnh tùy theo chiều cao input
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  linkText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: Fonts.normal,
    textDecorationLine: 'underline',
    textDecorationColor: colors.blue,
  },
});

export default AppStyles;
