import React, { createContext, useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

export const Context = createContext({});

let actions = {};

export const download = (filename, uri) => {
  const link = document.createElement("a");
  if (link.download !== undefined) {
    link.setAttribute("href", uri);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
};

const columns = ["username", "phone", "created"];
const dataToCsv = (headers, data) => {
  const content = data.map(wrapper => wrapper.join(",")).join("\n");
  const header = headers.join(",");
  download(
    "records.csv",
    encodeURI(`data:text/csv;charset=utf-8,${header}\n${content}`)
  );
};

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
      apiKey: process.env.GATSBY_API_KEY,
      authDomain: process.env.GATSBY_AUTH_DOMAIN,
      databaseURL: process.env.GATSBY_DATABASE_URL,
      projectId: process.env.GATSBY_PROJECT_ID,
      storageBucket: process.env.GATSBY_STORAGE_BUCKET,
      messagingSenderId: process.env.GATSBY_MESSAGING_SENDERID,
      appId: process.env.GATSBY_APP_ID,
      measurementId: process.env.GATSBY_MEASUREMENT_ID,
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
    exportRecords: async locationId => {
      const records = (
        await databaseService.current.ref(`records/${locationId}`).get()
      ).val();
      const recordMapper = record =>
        Array.from(columns, col => {
          const value = record[col];
          if (col === "created") {
            return new Date(value).toLocaleString().replaceAll(",", "");
          }
          return value;
        });
      dataToCsv(
        ["姓名", "電話", "時間"],
        Object.values(records).map(recordMapper)
      );
    },
  };

  return (
    <Context.Provider value={{ state, actions }}>{children}</Context.Provider>
  );
};
