import React, { createContext, useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

export const Context = createContext({});

let actions = {};

export const Provider = props => {
  const { children } = props;
  const [state, setState] = useState({
    uid: null,
    initialized: false,
  });
  const firebaseApp = useRef(null);
  const authService = useRef(null);
  const databaseService = useRef(null);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyDjQ0XQ-MoFukRYCoOqaVePWilAZm6sy_w",
      authDomain: "sign-f6dd6.firebaseapp.com",
      databaseURL: "https://sign-f6dd6-default-rtdb.firebaseio.com",
      projectId: "sign-f6dd6",
      storageBucket: "sign-f6dd6.appspot.com",
      messagingSenderId: "244113820790",
      appId: "1:244113820790:web:48075a9086b11a267f6357",
      measurementId: "G-S1P5XE8VZQ",
    };
    const app = firebase.initializeApp(firebaseConfig);
    app.auth().useDeviceLanguage();
    firebaseApp.current = app;
    authService.current = app.auth();
    databaseService.current = app.database();
    setState(prev => ({ ...prev, initialized: true }));
  }, []);

  useEffect(() => {
    if (!authService.current) {
      return;
    }
    authService.current.onAuthStateChanged(user => {
      if (!user) {
        setState(prev => ({ ...prev, uid: null }));
      } else {
        setState(prev => ({ ...prev, uid: user.uid }));
      }
    });
  }, [authService.current]);

  actions = {
    login: () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      authService.current
        .signInWithPopup(provider)
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        });
    },
    logout: () => {
      authService.current.signOut().catch(error => {
        console.log(error);
      });
    },
    getLocation: async uid => {
      return (
        await databaseService.current.ref(`locations/${uid}`).get()
      ).val();
    },
    setLocation: async location => {
      await databaseService.current.ref(`locations/${state.uid}`).set({
        ...location,
      });
    },
    sign: ({ locationId, userInfo }) => {
      return new Promise((resolve, reject) => {
        databaseService.current
          .ref(`records/${locationId}`)
          .push({ ...userInfo, created: Date.now() })
          .then(() => {
            resolve("success");
          })
          .catch(() => {
            reject("error");
          });
      });
    },
  };

  return (
    <Context.Provider value={{ state, actions }}>{children}</Context.Provider>
  );
};
