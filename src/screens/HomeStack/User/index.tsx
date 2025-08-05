import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import AppButton from '../../../components/AppButton';
import { navigate } from '../../../navigation/RootNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/reducers/userSlice';
import { Screen_Name } from '../../../navigation/ScreenName';
import { useTranslation } from 'react-i18next';

const UserScreen: React.FC = () => {
  const { t } = useTranslation();
  const token = useSelector((state: any) => state.user.token);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text>UserScreen Screen</Text>
      <AppButton
        title={token ? t('title.logout') : t('title.login')}
        onPress={() => {
          dispatch(logout()), navigate(Screen_Name.Login_Screen);
        }}
      ></AppButton>
    </View>
  );
};

export default UserScreen;
