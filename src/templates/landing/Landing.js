import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import jsQR from "jsqr";

const Landing = () => {
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
        closeCamera();
        return;
      }
    }
    const id = window.requestAnimationFrame(tick);
    setRequestId(id);
  }, []);

  const launchCamera = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
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
      <Video visible={requestId !== 0} ref={videoRef} />
      <div>{JSON.stringify(code, null, 2)}</div>
      <button onClick={launchCamera}>launch</button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const Video = styled.video`
  width: 300px;
  height: 70vh;
  border: 1px solid #000;
  display: ${({ visible }) => (visible ? "block" : "none")};
`;

export default Landing;
