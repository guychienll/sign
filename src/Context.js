import React, { createContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

export const Context = createContext({});

let actions = {};

export const Provider = props => {
  const { children } = props;
  const [state, setState] = useState({
    uid: null,
  });

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
    firebase.initializeApp(firebaseConfig);
    firebase.auth().useDeviceLanguage();
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        setState({ uid: null });
      } else {
        setState({ uid: user.uid });
      }
    });
  }, []);

  actions = {
    login: () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        });
    },
    logout: () => {
      firebase
        .auth()
        .signOut()
        .catch(error => {
          console.log(error);
        });
    },
  };

  return (
    <Context.Provider value={{ state, actions }}>{children}</Context.Provider>
  );
};
