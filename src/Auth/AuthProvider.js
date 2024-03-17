import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase-config';
import { signOut } from '@firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
