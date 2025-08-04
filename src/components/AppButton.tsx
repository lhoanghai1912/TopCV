// src/components/AppButton.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Image,
  View,
  ImageSourcePropType,
} from 'react-native';
import { colors } from '../utils/color';
import { spacing } from '../utils/spacing';
import { Fonts } from '../utils/fontSize';

interface AppButtonProps {
  // key?: number;
  onPress: () => void; // Hàm khi nhấn nút
  title?: string; // Tiêu đề nút
  customStyle?: ViewStyle[]; // Custom style cho nút
  disabled?: boolean;
  leftIcon?: ImageSourcePropType; // icon key trong ICONS
  textStyle?: TextStyle; // 👈 style cho text
}

const AppButton: React.FC<AppButtonProps> = ({
  // key,
  onPress,
  title,
  customStyle = [],
  disabled,
  leftIcon,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      // key={key}
      disabled={disabled}
      onPress={onPress}
      style={[
        disabled ? styles.buttonDisabled : styles.button,
        ...customStyle,
        { opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <View style={leftIcon ? styles.contentWrapper : ''}>
        {leftIcon && (
          <Image source={leftIcon} style={styles.icon} resizeMode="contain" />
        )}

        <Text
          style={[
            styles.buttonText,
            textStyle,

            { color: disabled ? colors.black : colors.white },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  //Button
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.button,
    borderRadius: 30,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  buttonDisabled: {
    color: colors.black,
    backgroundColor: colors.buttonDisable,
    borderRadius: 30,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
  },
  buttonText: {
    color: colors.white,
    fontSize: Fonts.normal,
    fontWeight: 500,
    textAlign: 'center',
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: spacing.small,
    tintColor: colors.white,
  },
});

export default AppButton;
