import React from "react";
import Layout from "./components/Layout";
import { Provider } from "./Context";
import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDjQ0XQ-MoFukRYCoOqaVePWilAZm6sy_w",
  authDomain: "sign-f6dd6.firebaseapp.com",
  projectId: "sign-f6dd6",
  storageBucket: "sign-f6dd6.appspot.com",
  messagingSenderId: "244113820790",
  appId: "1:244113820790:web:48075a9086b11a267f6357",
  measurementId: "G-S1P5XE8VZQ",
};

const app = firebase.initializeApp(firebaseConfig);

export const Container = props => {
  return <Layout {...props}>{props.children}</Layout>;
};

export const Root = props => {
  return <Provider {...props}>{props.children}</Provider>;
};
