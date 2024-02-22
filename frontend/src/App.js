// import React, { useRef, useState, useCallback, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import useWebSocket, { ReadyState } from 'react-use-websocket';
// import axios from 'axios';

// function getBase64StrFromUrl(dataUrl) {
//   const prefix = "base64,";
//   const sliceIndex = dataUrl.indexOf(prefix);
//   if (sliceIndex === -1) throw new Error("Expected base64 data URL");
//   return dataUrl.slice(sliceIndex + prefix.length);
// }

// // https://deno.land/std@0.182.0/encoding/base64.ts?source#L137
// function decode(base64Str) {
//   const binString = window.atob(base64Str);
//   const size = binString.length;
//   const bytes = new Uint8Array(size);
//   for (let i = 0; i < size; i++) {
//     bytes[i] = binString.charCodeAt(i);
//   }
//   return bytes;
// }



// function WebcamCapture () {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [imgSrc, setImgSrc] = useState("");
//   const [messageHistory, setMessageHistory] = useState([]);

//   // const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
//   const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:8000/ws/1');

//   const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

//   useEffect(() => {
//     if (lastMessage !== null) {
//       setMessageHistory((prev) => prev.concat(lastMessage));
//     }
//   }, [lastMessage, setMessageHistory]);

//   const handleClickChangeSocketUrl = useCallback(
//     () => setSocketUrl('wss://demos.kaazing.com/echo'),
//     []
//   );

//   const handleClickSendMessage = useCallback(() => sendMessage(webcamRef.current.getScreenshot()), []);

//   const connectionStatus = {
//     [ReadyState.CONNECTING]: 'Connecting',
//     [ReadyState.OPEN]: 'Open',
//     [ReadyState.CLOSING]: 'Closing',
//     [ReadyState.CLOSED]: 'Closed',
//     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
//   }[readyState];

//   async function capture () {
//     const imageSrc = webcamRef.current.getScreenshot();
//     // try {
//     //   await axios.post('/upload', { image: imageSrc });
//     //   console.log('Image sent to server.');
//     //   setImgSrc(imageSrc);
//     // } catch (error) {
//     //   console.error('Error sending image to server:', error);
//     // }
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <h1>Webcam Data to Server</h1>
//       <div style={{ margin: 'auto' }}>
//         <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
//         <canvas
//           ref={canvasRef}
//           // style={{
//           //   position: "absolute",
//           //   marginLeft: "auto",
//           //   marginRight: "auto",
//           //   left: 0,
//           //   right: 600,
//           //   top:20,
//           //   textAlign: "center",
//           //   zindex: 9,
//           //   width: 640,
//           //   height: 480,
//           // }}
//         />
//       </div>
//       <div style={{ margin: 'auto' }}>
//         <button
//           style={{
//             marginTop: '10px',
//             fontSize: '20px',
//             backgroundColor: '#423fff',
//             cursor: 'pointer',
//             borderRadius: "10px",
//             color: "white",
//             padding: "10px"
//           }}
//           onClick={capture}
//         >
//           Capture
//         </button>
//       </div>

//       {
//         imgSrc !== "" &&
//         <div style={{ marginTop: '20px' }}>
//           <h2>Captured Image</h2>
//           <img src={imgSrc} alt="Captured" style={{ marginTop: '10px' }} />
//         </div>
//       }

//     <button onClick={handleClickChangeSocketUrl}>
//         Click Me to change Socket Url
//       </button>
//       <button
//         onClick={handleClickSendMessage}
//         disabled={readyState !== ReadyState.OPEN}
//       >
//         Click Me to send 'Hello'
//       </button>
//       <span>The WebSocket is currently {connectionStatus}</span>
//       {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
//       <ul>
//         {messageHistory.map((message, idx) => (
//           <span key={idx}>{message ? message.data : null}</span>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default WebcamCapture;

import React, { useRef, useEffect } from "react";
import "./App.css";
// import logo from './logo.svg';

// import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  // const blazeface = require('@tensorflow-models/blazeface')

  //  Load blazeface
  const runFaceDetectorModel = async () => {

    // const model = await blazeface.load()
    console.log("FaceDetection Model is Loaded..") 
    setInterval(() => {
      // detect(model);
      detect("")
    }, 2000);
 
  }

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // const face = await net.estimateFaces(video);
      //console.log(face);

      // Websocket
      var socket = new WebSocket('ws://127.0.0.1:8000/ws/1')
      var imageSrc = webcamRef.current.getScreenshot()
      var apiCall = {
        event: "localhost:subscribe",
        data: { 
          image: imageSrc
        },
      };
      socket.onopen = () => socket.send(JSON.stringify(apiCall))
      socket.onmessage = function(event) {
        var resp = JSON.parse(event.data)
        var bbox = resp[0]["coordinates"]
        var name = resp[0]["cls"]
        console.log(resp)
        console.log(bbox)

        // Get canvas context
        const ctx = canvasRef.current.getContext("2d");
        requestAnimationFrame(()=>{drawMesh(bbox, name, ctx)});
      }
    }
  };

  useEffect(()=>{runFaceDetectorModel()}, []);
  return (
    <div className="App">
      <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 600,
            top:20,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 600,
            top:20,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      <header className="App-header">
        {/* <img src={logo} 
        className="App-logo" 
        alt="logo"
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          bottom:10,
          left: 0,
          right: 0,
          width: 150,
          height: 150,
        }}
        />    */}
        <div className="Prediction" style={{
          position:"absolute",
          right:100,
          width:500,
          top: 60
        }}>
          {/* <label forhtml="Angry" style={{color:'red'}}>Angry </label>
          <progress id="Angry" value="0" max = "100" >10%</progress>
          <br></br>
          <br></br>
          <label forhtml="Neutral" style={{color:'lightgreen'}}>Neutral </label>
          <progress id="Neutral" value="0" max = "100">10%</progress>
          <br></br>
          <br></br>
          <label forhtml="Happy" style={{color:'orange'}}>Happy </label>
          <progress id="Happy" value="0" max = "100" >10%</progress>
          <br></br>
          <br></br>
          <label forhtml="Fear" style={{color:'lightblue'}}>Fear </label>
          <progress id="Fear" value="0" max = "100" >10%</progress>
          <br></br>
          <br></br>
          <label forhtml="Surprise" style={{color:'yellow'}}>Surprised </label>
          <progress id="Surprise" value="0" max = "100" >10%</progress>
          <br></br>
          <br></br>
          <label forhtml="Sad" style={{color:'gray'}} >Sad </label>
          <progress id="Sad" value="0" max = "100" >10%</progress>
          <br></br>
          <br></br> */}
          {/* <label forhtml="Disgust" style={{color:'pink'}} >Disgusted </label>
          <progress id="Disgust" value="0" max = "100" >10%</progress> */}
        </div>
        <input id="emotion_text" name="emotion_text" vale="Neutral"
               style={{
                 position:"absolute",
                 width:200,
                 height:50,
                 bottom:60,
                 left:300,
                 "font-size": "30px",
               }}></input>
      </header>
    </div>
  );
}

export default App;