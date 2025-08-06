import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import { Screen_Name } from './ScreenName';
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/AuthStack/Login';
import RegisterScreen from '../screens/AuthStack/Register';
import SetPasswordScreen from '../screens/AuthStack/SetPassword';
import DetailsScreen from '../screens/HomeStack/Details';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={Screen_Name.BottomTab_Navigator}
    >
      <Stack.Screen
        name={Screen_Name.BottomTab_Navigator}
        component={BottomTabNavigator}
      />
      <Stack.Screen name={Screen_Name.Home_Screen} component={HomeScreen} />
      <Stack.Screen name={Screen_Name.Login_Screen} component={LoginScreen} />
      <Stack.Screen
        name={Screen_Name.Register_Screen}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={Screen_Name.SetPassword_Screen}
        component={SetPasswordScreen}
      />
      <Stack.Screen
        name={Screen_Name.Details_Screen}
        component={DetailsScreen}
      />
    </Stack.Navigator>
  );
};
export default HomeNavigator;
