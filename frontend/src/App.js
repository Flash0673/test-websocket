import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import axios from 'axios';

function getBase64StrFromUrl(dataUrl) {
  const prefix = "base64,";
  const sliceIndex = dataUrl.indexOf(prefix);
  if (sliceIndex === -1) throw new Error("Expected base64 data URL");
  return dataUrl.slice(sliceIndex + prefix.length);
}

// https://deno.land/std@0.182.0/encoding/base64.ts?source#L137
function decode(base64Str) {
  const binString = window.atob(base64Str);
  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}



function WebcamCapture () {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  // const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
  const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:8000/ws/1');

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('wss://demos.kaazing.com/echo'),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage(webcamRef.current.getScreenshot()), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  async function capture () {
    const imageSrc = webcamRef.current.getScreenshot();
    // try {
    //   await axios.post('/upload', { image: imageSrc });
    //   console.log('Image sent to server.');
    //   setImgSrc(imageSrc);
    // } catch (error) {
    //   console.error('Error sending image to server:', error);
    // }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Webcam Data to Server</h1>
      <div style={{ margin: 'auto' }}>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      </div>
      <div style={{ margin: 'auto' }}>
        <button
          style={{
            marginTop: '10px',
            fontSize: '20px',
            backgroundColor: '#423fff',
            cursor: 'pointer',
            borderRadius: "10px",
            color: "white",
            padding: "10px"
          }}
          onClick={capture}
        >
          Capture
        </button>
      </div>

      {
        imgSrc !== "" &&
        <div style={{ marginTop: '20px' }}>
          <h2>Captured Image</h2>
          <img src={imgSrc} alt="Captured" style={{ marginTop: '10px' }} />
        </div>
      }

    <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
};

export default WebcamCapture;