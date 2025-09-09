import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
  StyleProp,
  TextStyle,
  Image,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import AppStyles from './AppStyle';
import { Fonts } from '../utils/fontSize';
import icons from '../assets/icons';
import { ms, spacing } from '../utils/spacing';
import { colors } from '../utils/color';
import { ImageSourcePropType } from 'react-native';

interface AppInputProps extends TextInputProps {
  leftIcon?: ImageSourcePropType;
  label?: string;
  error?: string;
  style?: StyleProp<TextStyle>;
  clearStyle?: ImageStyle;
}

const AppInput: React.FC<AppInputProps> = ({
  leftIcon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  label,
  error,
  clearStyle,
  editable = true,
  ...props
}) => {
  const [isShow, setIsShow] = useState(false);
  const handleShowHide = async () => {
    setIsShow(!isShow);
  };
  const handleClear = async () => {
    onChangeText?.('');
  };
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.input}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[AppStyles.icon, { marginRight: spacing.small }]}
            resizeMode="contain"
          />
        )}
        <TextInput
          editable={editable}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isShow}
          keyboardType={keyboardType}
          style={[
            style,
            error && styles.errorBorder,
            {
              fontSize: Fonts.normal,
              flex: 1,
            },
          ]}
          placeholderTextColor="#999999"
          {...props}
        />
        {editable && (
          <>
            {secureTextEntry ? (
              <View style={AppStyles.iconGroup}>
                <TouchableOpacity onPress={handleShowHide}>
                  <Image
                    source={isShow ? icons.show_pass : icons.hide}
                    style={[
                      AppStyles.icon,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClear}>
                  <Image
                    source={icons.clear}
                    style={[
                      AppStyles.icon,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  ></Image>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={AppStyles.iconSingle}>
                <TouchableOpacity onPress={handleClear}>
                  <Image
                    source={icons.clear}
                    style={[
                      AppStyles.icon,
                      clearStyle,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.medium,
    width: '100%',
  },
  label: {
    fontSize: Fonts.large,
    marginBottom: spacing.small,
    color: colors.black,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 20,
    paddingHorizontal: spacing.medium,
    color: '999999',
    backgroundColor: '#F4F5F5',
    fontSize: Fonts.normal,
  },
  errorBorder: {
    borderColor: '#ff5a5f',
  },
  errorText: {
    color: '#ff5a5f',
    fontSize: Fonts.small,
    marginTop: ms(8),
  },
});

export default AppInput;
