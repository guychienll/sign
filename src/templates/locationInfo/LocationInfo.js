import React, { useEffect, useState } from "react";
import styled from "styled-components";
import QRCode from "qrcode.react";
import { Button, Form, Input, Empty } from "antd";

const LocationInfo = () => {
  const [form] = Form.useForm();
  const [code, setCode] = useState(null);

  useEffect(() => {
    if (typeof window) {
      const parse = JSON.parse(window.localStorage.getItem("locationInfo"));
      if (parse) {
        setCode(parse);
        form.setFieldsValue(parse);
      }
    }
  }, []);

  const onFinish = () => {
    window.localStorage.setItem("locationInfo", JSON.stringify(code));
  };

  const onFinishFailed = errorInfo => {
    alert("check form");
  };

  return (
    <Wrapper>
      {code && (
        <QRCode value={JSON.stringify(code)} style={{ marginBottom: 24 }} />
      )}
      {!code && <Empty description={false} />}
      <Form
        form={form}
        name="basic"
        initialValues={code}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Username" name="username">
          <Input
            onChange={e => {
              setCode({ ...code, username: e.target.value });
            }}
          />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input
            onChange={e => {
              setCode({ ...code, phone: e.target.value });
            }}
          />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input
            onChange={e => {
              setCode({ ...code, address: e.target.value });
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

export default LocationInfo;
