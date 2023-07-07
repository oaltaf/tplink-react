import React, {createContext, useEffect, useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';

export const UserContext = createContext();

export default function UserContextProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cloudToken, setCloudToken] = useState(null);
  const [devices, setDevices] = useState([]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      if (error.code === 'auth/user-not-found') {
        console.log(`User doesn't exists`);
      }

      if (error.code === 'auth/user-disabled') {
        console.log(`User is disabled`);
      }

      console.error(error);
      throw error;
    }
  };

  const logOut = async () => {
    setLoading(true);
    await auth().signOut();
    console.log('User signed out');
    // setUser(null);
    // setUserToken(null);
    // setLoading(false);
  };

  function onAuthStateChanged(user) {
    // console.log('Auth state changed :: ', user);
    setUser(user);
    setLoading(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setLoading,
        Login: login,
        logOut,
      }}>
      {props.children}
    </UserContext.Provider>
  );
}
