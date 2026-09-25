import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useBookingStore } from '../store/useBookingStore';
import { queryClient } from '../lib/queryClient';

// A single subscription lives in the root layout; screens read the shared store.
export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const setStoreUser = useBookingStore(state => state.setUser);

  useEffect(() => {
    let previousUid: string | null = null;
    return onAuthStateChanged(auth, firebaseUser => {
      const user = firebaseUser && !firebaseUser.isAnonymous ? firebaseUser : null;
      if (previousUid !== user?.uid) queryClient.clear();
      previousUid = user?.uid ?? null;
      setStoreUser(user ? {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Sinh viên VKU',
        email: user.email ?? undefined,
      } : null);
      setError(false);
      setLoading(false);
    }, () => {
      setStoreUser(null);
      setError(true);
      setLoading(false);
    });
  }, [setStoreUser]);

  return { loading, error };
};
