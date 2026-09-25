import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { signOutOfGoogle } from './googleAuth';

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName?.trim() && userCredential.user) {
    await updateProfile(userCredential.user, { displayName: displayName.trim() });
  }
  return userCredential.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
};

export const signOutUser = async () => {
  await signOutOfGoogle();
  await firebaseSignOut(auth).catch(() => undefined);
};
