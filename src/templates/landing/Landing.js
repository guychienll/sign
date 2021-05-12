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
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setCode(code.data);
        // closeCamera();
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
          // facingMode: "user",
        },
      })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        tick();
      });
  }, []);

  return (
    <div>
      <Video autoplay playsinline muted ref={videoRef} />
      <canvas ref={canvasRef} />
      <button onClick={launchCamera}>launch camera</button>
      <pre>{JSON.stringify(code, null, 2)}</pre>
    </div>
  );
};

const Video = styled.video`
  width: 500px;
  height: 500px;
`;

export default Landing;
