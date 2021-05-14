import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import jsQR from "jsqr";
import { Button } from "antd";
import firebase from "firebase/app";
import { uid } from "uid";

const Scan = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [requestId, setRequestId] = useState(0);
  const [code, setCode] = useState(null);

  const closeCamera = useCallback(() => {
    const video = videoRef.current;
    video.pause();
    window.cancelAnimationFrame(requestId);
    video.srcObject.getTracks().forEach(function (track) {
      track.stop();
    });
    video.srcObject = null;
    setRequestId(0);
  }, []);

  const tick = useCallback(() => {
    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setCode(code.data);
        const l = JSON.parse(code.data);
        const u = JSON.parse(window.localStorage.getItem("userInfo"));
        firebase
          .database()
          .ref(`records/${uid(16)}`)
          .set({
            locationName: l.username,
            locationPhone: l.phone,
            locationAddress: l.address,
            userName: u.username,
            userPhone: u.phone,
            taiwanId: u.id,
          });

        closeCamera();
        return;
      }
    }
    const id = window.requestAnimationFrame(tick);
    setRequestId(id);
  }, []);

  const launchCamera = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: 300,
          height: 400,
        },
      })
      .then(stream => {
        const video = videoRef.current;
        video.setAttribute("autoplay", "");
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.srcObject = stream;
        videoRef.current.play();
        tick();
      });
  }, []);

  return (
    <Wrapper>
      <Video ref={videoRef} />
      <Button disabled={requestId !== 0} onClick={launchCamera}>
        launch
      </Button>
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

const Video = styled.video`
  width: 300px;
  height: 400px;
  border: 5px solid #000;
  // display: ${({ visible }) => (visible ? "block" : "none")};
  margin-bottom: 24px;
`;

export default Scan;
