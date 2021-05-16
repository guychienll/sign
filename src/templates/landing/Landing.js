import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { Button, Form, Input, Result, Spin } from "antd";
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
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();

  const fetchLocation = useCallback(async locationId => {
    setIsLoading(true);
    const resp = await app.actions.getLocation(locationId);
    setLocationInfo(resp);
    form.setFieldsValue(resp);
    setIsLoading(false);
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

  if (isLoading) {
    return (
      <Wrapper>
        <Spin />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {!locationInfo && (
        <Result status="warning" title="無地點資訊" extra={[]} />
      )}
      {locationInfo && !signStatus && (
        <Fragment>
          <div className="location-name">{locationInfo.locationName}</div>
          <Form
            form={form}
            size="large"
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
              label="姓名(Full Name)"
              name="username"
              rules={[{ required: true, message: "請輸入姓名" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="手機(Phone)"
              name="phone"
              rules={[{ required: true, message: "請輸入手機" }]}
            >
              <Input maxLength={10} />
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
