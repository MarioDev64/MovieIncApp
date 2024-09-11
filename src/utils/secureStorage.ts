import * as SecureStore from 'expo-secure-store';

export const saveKey = async (key:string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getKey = async (key:string) => {
  return await SecureStore.getItemAsync(key);
};

export const removeKey = async (key:string) => {
  await SecureStore.deleteItemAsync(key);
};