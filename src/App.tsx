/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './language'; // Import trước mọi component

import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './navigation/AppNavigator';
import store from './store';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId:
    '889651278132-9gqdqpcgvhrnlvehmuuhgcf2ilnb3uhf.apps.googleusercontent.com',
  offlineAccess: true,
});
import { Settings, AppEventsLogger } from 'react-native-fbsdk-next';
import { useEffect } from 'react';

enableScreens(); // Bật tính năng screens để sử dụng trong navigation
function App() {
  useEffect(() => {
    // (tuỳ chọn) set App ID & bật auto init nếu muốn chủ động
    // Settings.setAppID("YOUR_FACEBOOK_APP_ID");
    Settings.setAutoLogAppEventsEnabled(true); // đảm bảo auto-log
    Settings.initializeSDK(); // tương đương ghi sự kiện kích hoạt app (fb_mobile_activate_app)
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar barStyle="light-content" translucent={false} />
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
