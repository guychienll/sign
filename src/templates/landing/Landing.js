import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { Button, Form, Input, Result } from "antd";
import qs from "query-string";
import { Context } from "../../Context";

const Landing = props => {
  const { location } = props;
  const app = useContext(Context);
  const { search } = location;
  const { location_id } = qs.parse(search);
  const [userInfo, setUserInfo] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [signStatus, setSignStatus] = useState(null);
  const [form] = Form.useForm();

  const fetchLocation = useCallback(async locationId => {
    const resp = await app.actions.getLocation(locationId);
    setLocationInfo(resp);
    form.setFieldsValue(resp);
  }, []);

  useEffect(() => {
    if (!location_id || !app.state.initialized) {
      return;
    }
    fetchLocation(location_id).then(() => {});
  }, [location_id, app.state.initialized]);

  useEffect(() => {
    if (typeof window) {
      const parse = JSON.parse(window.localStorage.getItem("userInfo"));
      setUserInfo(parse);
      form.setFieldsValue(parse);
    }
  }, []);

  const onSign = async () => {
    setSignStatus(
      await app.actions.sign({
        locationId: location_id,
        userInfo: userInfo,
      })
    );
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
      {!location_id && (
        <Result status="warning" title="無店家資訊" extra={[]} />
      )}
      {location_id && !signStatus && (
        <Fragment>
          {!locationInfo && (
            <div className="location-name">獲取店家資訊中...</div>
          )}
          {locationInfo && (
            <div className="location-name">{locationInfo.locationName}</div>
          )}
          <Form
            form={form}
            name="basic"
            initialValues={userInfo}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Form.Item
              label="使用者名稱"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="使用者聯絡電話"
              name="phone"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            {userInfo ? (
              <Form.Item>
                <Button style={{ width: "100%" }} onClick={onSign}>
                  一鍵實名制
                </Button>
              </Form.Item>
            ) : (
              <Form.Item>
                <Button style={{ width: "100%" }} htmlType="submit">
                  儲存資訊
                </Button>
              </Form.Item>
            )}
          </Form>
        </Fragment>
      )}
      {signStatus && (
        <Result
          status={signStatus}
          title={signStatus === "success" ? "實名制登記成功" : "實名制登記失敗"}
          subTitle=""
          extra={[]}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 10px;
  & > .location-name {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

export default Landing;
