import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../firebase-config";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  const authStateChanged = (user) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }
    console.log("authUser:", user);
    setAuthUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });
    setIsLoading(false);
  };

  const signOut = () => authSignOut(auth).then(clear);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return { authUser, isLoading, signOut };
}

export function AuthUserProvider({ children }) {
  const authContext = useFirebaseAuth();

  return (
    <AuthUserContext.Provider value={authContext}>
      {children}
    </AuthUserContext.Provider>
  );
}

export const useAuth = () => useContext(AuthUserContext);
