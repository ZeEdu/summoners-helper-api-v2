import * as SecureStore from 'expo-secure-store';
import Utils from '../utils/utils';

const SecureStoreService = {
  get: async (key: string) => {
    if (Utils.isWeb) {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  set: async (key: string, value: any) => {
    if (Utils.isWeb) {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value)
  },
  delete: async (key: string) => {
    if (Utils.isWeb) {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export default SecureStoreService