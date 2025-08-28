import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeStack/HomeScreen';
import { Screen_Name } from './ScreenName';
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/AuthStack/Login';
import RegisterScreen from '../screens/AuthStack/Register';
import SetPasswordScreen from '../screens/AuthStack/SetPassword';
import CompanyScreen from '../screens/HomeStack/Company';
import DetailsCompanyScreen from '../screens/HomeStack/Company/DetailCompany';
import DetailJobScreen from '../screens/HomeStack/Job/Detail_Job';
import SavedJobScreen from '../screens/HomeStack/Job/Saved_Job';
import EditCVScreen from '../screens/HomeStack/CV/CreateCV/editCV';
import UpdateInfoScreen from '../screens/HomeStack/User/UpdateInfo';
import { updatePassword } from '../services/auth';
import UpdatePasswordScreen from '../screens/HomeStack/User/ChangePassword';
import FollowedCompanyScreen from '../screens/HomeStack/Company/Followed_Company';
import CardCV from '../screens/HomeStack/CV/Card';
import CVScreen from '../screens/HomeStack/CV';
import CreateCVScreen from '../screens/HomeStack/CreateCV';
import DetailsCv from '../screens/HomeStack/CV/Details';

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
        name={Screen_Name.DetailJob_Screen}
        component={DetailJobScreen}
      />
      <Stack.Screen
        name={Screen_Name.Company_Screen}
        component={CompanyScreen}
      />
      <Stack.Screen
        name={Screen_Name.DetailCompany_Screen}
        component={DetailsCompanyScreen}
      />
      <Stack.Screen
        name={Screen_Name.SavedJob_Screen}
        component={SavedJobScreen}
      />
      <Stack.Screen name={Screen_Name.EditCV_Screen} component={EditCVScreen} />
      <Stack.Screen
        name={Screen_Name.UpdateInfo_Screen}
        component={UpdateInfoScreen}
      />
      <Stack.Screen
        name={Screen_Name.UpdatePassword_Screen}
        component={UpdatePasswordScreen}
      />
      <Stack.Screen
        name={Screen_Name.FollowedCompany_Screen}
        component={FollowedCompanyScreen}
      />
      <Stack.Screen name={Screen_Name.CV_Screen} component={CVScreen} />
      <Stack.Screen
        name={Screen_Name.CreateCV_Screen}
        component={CreateCVScreen}
      />
      <Stack.Screen name={Screen_Name.DetailCV} component={DetailsCv} />
    </Stack.Navigator>
  );
};
export default HomeNavigator;
