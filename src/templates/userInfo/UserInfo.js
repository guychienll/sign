import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Form, Input } from "antd";
import QRCode from "qrcode.react";

const city = [
  1,
  10,
  19,
  28,
  37,
  46,
  55,
  64,
  39,
  73,
  82,
  2,
  11,
  20,
  48,
  29,
  38,
  47,
  56,
  65,
  74,
  83,
  21,
  3,
  12,
  30,
];

const getIsIdentityValid = identity => {
  if (identity.toUpperCase().search(/^[A-Z](1|2)\d{8}$/i) === -1) {
    return {
      validateStatus: "error",
      errorMsg: "The prime between 8 and 12 is 11!",
    };
  } else {
    const identityNumList = identity.toUpperCase().split("");

    let total = city[identityNumList[0].charCodeAt(0) - 65];

    for (let i = 1; i <= 8; i++) {
      total += eval(identityNumList[i]) * (9 - i);
    }

    total += eval(identityNumList[9]);

    if (total % 10 === 0) {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    } else {
      return {
        validateStatus: "error",
        errorMsg: "The prime between 8 and 12 is 11!",
      };
    }
  }
};

const UserInfo = () => {
  const [taiwanId, setTaiwanId] = useState({ value: "" });
  const [code, setCode] = useState(
    JSON.parse(window.localStorage.getItem("userInfo"))
  );

  const onFinish = values => {
    window.localStorage.setItem("userInfo", JSON.stringify(values));
  };

  const onFinishFailed = errorInfo => {
    alert("check form");
  };

  return (
    <Wrapper>
      <QRCode value={JSON.stringify(code)} style={{ marginBottom: 24 }} />
      <Form
        name="basic"
        initialValues={code}
        onFinish={onFinish}
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

        <Form.Item
          label="Taiwan ID"
          name="id"
          validateStatus={taiwanId.validateStatus}
          help={taiwanId.errorMsg}
        >
          <Input
            onChange={e => {
              const { value } = e.target;
              if (!value) {
                setTaiwanId({
                  value,
                  validateStatus: "success",
                  errorMsg: null,
                });
              } else {
                setTaiwanId({ ...getIsIdentityValid(value), value });
              }
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
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

export default UserInfo;
