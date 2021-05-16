import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import QRCode from "qrcode.react";
import { Button, Empty, Form, Input } from "antd";
import firebase from "firebase";
import { Context } from "../../Context";
import { HOST } from "../../constants";

const columns = ['username', 'phone', 'created']
const dataToCsv = data => {
  const content = data.map(wrapper => wrapper.join(',')).join('\n')
  const header = '姓名,電話,時間'
  window.open(encodeURI(`data:text/csv;charset=utf-8,${header}\n${content}`))
}
const exportRecords = async locationId => {
  const db = firebase.database()
  const records = (await db.ref(`records/${locationId}`).get()).val()
  const recordMapper = record =>
    Array.from(
      columns,
      col => {
        const value = record[col]
        if (col === 'created') {
          return (new Date(value)).toLocaleString().replaceAll(',', '')
        }
        return value
      }
    )
  dataToCsv(Object.values(records).map(recordMapper))
}

const Admin = () => {
  const app = useContext(Context);
  const [form] = Form.useForm();
  const [locationInfo, setLocationInfo] = useState(null);

  const fetchLocation = useCallback(async uid => {
    const resp = (
      await firebase.database().ref(`locations/${uid}`).get()
    ).val();
    setLocationInfo(resp);
    form.setFieldsValue(resp);
  }, []);

  useEffect(() => {
    if (!app.state.uid) {
      return;
    }
    fetchLocation(app.state.uid).then(() => {});
  }, [app.state.uid]);

  const onSubmit = async values => {
    await firebase
      .database()
      .ref(`locations/${app.state.uid}`)
      .set({
        ...values,
      });
  };
  const onFinishFailed = errorInfo => {
    alert(JSON.stringify(errorInfo, null, 2));
  };
  return (
    <Wrapper>
      {app.state.uid && (
        <Fragment>
          {locationInfo && (
            <QRCode
              value={`${HOST}?location_id=${app.state.uid}`}
              style={{ marginBottom: 24 }}
            />
          )}
          {!locationInfo && <Empty description={false} />}
          <Form
            form={form}
            name="basic"
            initialValues={locationInfo}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="地點名稱"
              name="locationName"
              rules={[{ required: true, message: "請輸入地點名稱" }]}
            >
              <Input
                onChange={e => {
                  setLocationInfo({
                    ...locationInfo,
                    username: e.target.value,
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              label="地點聯絡電話"
              name="locationPhone"
              rules={[{ required: true, message: "請輸入地點聯絡電話" }]}
            >
              <Input
                onChange={e => {
                  setLocationInfo({ ...locationInfo, phone: e.target.value });
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: "100%", marginBottom: 20 }}
                htmlType="submit"
              >
                儲存地點資料
              </Button>
            </Form.Item>
          </Form>

          <Button style={{ width: "80%", marginBottom: 20 }} onClick={() => {}}>
            下載 QR Code
          </Button>

          <Button style={{ width: "80%", marginBottom: 20 }} onClick={() => exportRecords(app.state.uid)}>
            匯出紀錄
          </Button>
        </Fragment>
      )}

      {!app.state.uid ? (
        <Button
          style={{ width: "80%" }}
          onClick={() => {
            app.actions.login();
          }}
        >
          使用 google 登入 / 註冊
        </Button>
      ) : (
        <Button
          style={{ width: "80%" }}
          onClick={() => {
            app.actions.logout();
          }}
        >
          登出
        </Button>
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
`;

export default Admin;
