import { GoogleAuthProvider, linkWithPopup, signInWithPopup, signInWithCredential, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  if (!auth.currentUser?.isAnonymous) return signInWithPopup(auth, provider);
  try {
    // Preserve bookings made with the old anonymous session when possible.
    return await linkWithPopup(auth.currentUser, provider);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error &&
        error.code === 'auth/credential-already-in-use') {
      const credential = GoogleAuthProvider.credentialFromError(error as Parameters<typeof GoogleAuthProvider.credentialFromError>[0]);
      if (credential) return signInWithCredential(auth, credential);
    }
    throw error;
  }
};

export const signOutOfGoogle = () => signOut(auth);
