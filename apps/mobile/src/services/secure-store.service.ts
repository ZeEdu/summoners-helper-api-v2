import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const notMobile = () => {
  return Platform.OS !== 'android' && Platform.OS !== 'ios';
};
const SecureStoreService = {
  get: async (key: string) => {
    if (notMobile()) {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  set: async (key: string, value: any) => {
    if (notMobile()) {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value)
  },
  delete: async (key: string) => {
    if (notMobile()) {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export default SecureStoreService