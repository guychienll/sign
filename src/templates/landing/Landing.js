import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Form, Input } from "antd";
import firebase from "firebase";
import qs from "query-string";

firebase.auth().useDeviceLanguage();

const Landing = props => {
  const { location } = props;
  const { search } = location;
  const { location_id } = qs.parse(search);
  const [userInfo, setUserInfo] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [form] = Form.useForm();

  const fetchLocation = useCallback(async uid => {
    const resp = (
      await firebase.database().ref(`locations/${uid}`).get()
    ).val();
    setLocationInfo(resp);
    form.setFieldsValue(resp);
  }, []);

  useEffect(() => {
    if (!location_id) {
      return;
    }
    fetchLocation(location_id).then(() => {});
  }, [location_id]);

  useEffect(() => {
    if (typeof window) {
      const parse = JSON.parse(window.localStorage.getItem("userInfo"));
      setUserInfo(parse);
      form.setFieldsValue(parse);
    }
  }, []);

  const onSign = async () => {
    firebase
      .database()
      .ref(`records/${location_id}`)
      .push({ ...userInfo });
  };

  const onSubmit = values => {
    setUserInfo(values);
    window.localStorage.setItem("userInfo", JSON.stringify(values));
  };

  const onFinishFailed = errorInfo => {
    alert("check form");
  };

  return (
    <Wrapper>
      {locationInfo && <h2>{locationInfo.locationName}</h2>}
      <Form
        form={form}
        name="basic"
        initialValues={userInfo}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        {userInfo ? (
          <Form.Item>
            <Button onClick={onSign}>一鍵實名制</Button>
          </Form.Item>
        ) : (
          <Form.Item>
            <Button htmlType="submit">Save</Button>
          </Form.Item>
        )}
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 10px;
`;

export default Landing;
