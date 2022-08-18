import React, { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import { drawKeypoints, drawSkeleton } from './utilities';
import '@tensorflow/tfjs-backend-webgl';

import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  //Load Posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: {width:640, height:480},
      scale: 0.5
    })
    // Set Interval
    setInterval(() =>{
      detect(net)
    }, 100)
  };
  const detect = async (net) => {
    if(typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.width;
      const videoHeight = webcamRef.current.video.height;

      // Set Video Width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const pose = await net.estimateSinglePose(video);
      console.log(pose);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  }

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext('2d');
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.5, ctx);
    drawSkeleton(pose["keypoints"], 0.5, ctx);
  }

  runPosenet();
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }} />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }} />
      </header>
    </div>
  );
}

export default App;
