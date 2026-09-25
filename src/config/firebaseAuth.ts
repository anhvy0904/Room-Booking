import { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const initializeAppAuth = (app: FirebaseApp) => getAuth(app);
