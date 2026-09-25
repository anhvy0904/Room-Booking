import Constants, { ExecutionEnvironment } from 'expo-constants';
import { GoogleAuthProvider, linkWithCredential, signInWithCredential, signOut } from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../config/firebase';

const getGoogleSignIn = async () => {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    throw Object.assign(new Error('Google Sign-In requires a development build'), { code: 'google/expo-go' });
  }
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  if (!webClientId || (Platform.OS === 'ios' && !iosClientId)) {
    throw Object.assign(new Error('Missing Google client ID'), { code: 'google/missing-config' });
  }
  // Do not load this native module at startup: Expo Go does not contain it.
  const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
  GoogleSignin.configure({ webClientId, iosClientId });
  return GoogleSignin;
};

export const signInWithGoogle = async () => {
  const google = await getGoogleSignIn();
  await google.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const result = await google.signIn();
  if (result.type === 'cancelled') return null;
  const idToken = result.data.idToken;
  if (!idToken) throw Object.assign(new Error('Missing ID token'), { code: 'google/missing-config' });
  const credential = GoogleAuthProvider.credential(idToken);
  if (auth.currentUser?.isAnonymous) {
    try {
      return await linkWithCredential(auth.currentUser, credential);
    } catch (error) {
      if (!(typeof error === 'object' && error !== null && 'code' in error && error.code === 'auth/credential-already-in-use')) throw error;
    }
  }
  return signInWithCredential(auth, credential);
};

export const signOutOfGoogle = async () => {
  await signOut(auth);
  if (Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    // Firebase sign-out is authoritative even if the native session already expired.
    await GoogleSignin.signOut().catch(() => undefined);
  }
};
