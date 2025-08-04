'use client';

import { ReactNode, createContext, useContext } from 'react';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { app } from '@/lib/firebase';

const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);

const FirebaseContext = createContext({
  auth,
  storage,
  db
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseContext.Provider value={{ auth, storage, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
