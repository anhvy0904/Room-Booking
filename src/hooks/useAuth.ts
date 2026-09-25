import { useEffect, useState } from 'react';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useBookingStore } from '../store/useBookingStore';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setStoreUser = useBookingStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setStoreUser({ id: firebaseUser.uid, name: 'Anonymous Student' });
        setLoading(false);
      } else {
        try {
          // Attempt to sign in anonymously if not authenticated
          const credential = await signInAnonymously(auth);
          setUser(credential.user);
          setStoreUser({ id: credential.user.uid, name: 'Anonymous Student' });
        } catch (error) {
          console.error('Anonymous auth failed:', error);
        } finally {
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, [setStoreUser]);

  return { user, loading };
};
