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

enableScreens(); // Bật tính năng screens để sử dụng trong navigation
function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" translucent={false} />
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppNavigator />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
