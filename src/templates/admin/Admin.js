import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import QRCode from "qrcode.react";
import { Button, Empty, Form, Input, Spin } from "antd";
import { Context, download } from "../../Context";

const Admin = () => {
  const app = useContext(Context);
  const [form] = Form.useForm();
  const [locationInfo, setLocationInfo] = useState(null);
  const [qrCodeLink, setQrCodeLink] = useState("");
  const [disabledEdit, setDisabledEdit] = useState(false);

  const fetchLocation = useCallback(async uid => {
    const resp = await app.actions.getLocation(uid);
    setLocationInfo(resp);
    form.setFieldsValue(resp);
    if (resp) {
      setDisabledEdit(true);
    }
  }, []);

  useEffect(() => {
    if (!app.state.uid || !app.state.initialized) {
      return;
    }
    fetchLocation(app.state.uid).then(() => {});
  }, [app.state.uid, app.state.initialized]);

  useEffect(() => {
    if (typeof document && locationInfo) {
      const qrcode = document.querySelector("#qrcode");
      const link = qrcode
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      setQrCodeLink(link);
    }
  }, [locationInfo]);

  const onSubmit = async values => {
    await app.actions.setLocation(values);
    setDisabledEdit(true);
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
              renderAs="canvas"
              id="qrcode"
              value={`${window.location.origin}/?location_id=${app.state.uid}`}
              style={{ marginBottom: 24 }}
            />
          )}
          {!locationInfo && <Empty description={false} />}
          <Form
            form={form}
            name="basic"
            size="large"
            initialValues={locationInfo}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="????????????"
              name="locationName"
              rules={[{ required: true, message: "?????????????????????" }]}
            >
              <Input
                disabled={disabledEdit}
                onChange={e => {
                  setLocationInfo({
                    ...locationInfo,
                    username: e.target.value,
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              label="??????????????????"
              name="locationPhone"
              rules={[{ required: true, message: "???????????????????????????" }]}
            >
              <Input
                maxLength={10}
                disabled={disabledEdit}
                onChange={e => {
                  setLocationInfo({
                    ...locationInfo,
                    phone: e.target.value,
                  });
                }}
              />
            </Form.Item>

            {!disabledEdit && (
              <Form.Item>
                <Button
                  type="primary"
                  disabled={!locationInfo}
                  style={{ width: "100%" }}
                  htmlType="submit"
                >
                  ??????????????????
                </Button>
              </Form.Item>
            )}

            {disabledEdit && (
              <Form.Item>
                <Button
                  ghost
                  onClick={() => {
                    setDisabledEdit(false);
                  }}
                  style={{ width: "100%" }}
                >
                  ??????????????????
                </Button>
              </Form.Item>
            )}
          </Form>

          <Button
            size="large"
            type="primary"
            disabled={!locationInfo}
            style={{ width: "80%", marginBottom: 20 }}
            onClick={() => {
              download("QR_code.png", qrCodeLink)
            }}
          >
            ?????? QR Code
          </Button>

          <Button
            size="large"
            type="primary"
            style={{ width: "80%", marginBottom: 20 }}
            onClick={async () => {
              await app.actions.exportRecords(app.state.uid);
            }}
          >
            ?????????????????????
          </Button>
        </Fragment>
      )}

      {!app.state.uid ? (
        <Button
          size="large"
          style={{ width: "80%" }}
          onClick={() => {
            app.actions.login();
          }}
        >
          ?????? google ?????? / ??????
        </Button>
      ) : (
        <Button
          ghost
          size="large"
          style={{ width: "80%", marginTop: "auto" }}
          onClick={() => {
            app.actions.logout();
          }}
        >
          ??????
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
