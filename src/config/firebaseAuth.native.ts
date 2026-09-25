import { FirebaseApp, FirebaseError } from 'firebase/app';
// Firebase's public typings omit this export; Metro's native entry exports it.
// @ts-expect-error React Native-only Firebase export.
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initializeAppAuth = (app: FirebaseApp) => {
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'auth/already-initialized') return getAuth(app);
    throw error;
  }
};
