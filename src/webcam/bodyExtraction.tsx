import { Dimension, typeDimension } from "../helper";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { useEffect, useRef, useState } from "react";
// Uncomment the line below if you want to use TF.js runtime.
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import Canvas from "../3Dscene";
// Uncomment the line below if you want to use MediaPipe runtime.
// import "@mediapipe/pose";

function Camera() {
  const dimension = Dimension() as typeDimension;
  const webRef = useRef<Webcam>(null);
  let kp: any = null;

  const getkp = () => {
    return kp;
  };

  const updatekp = (newkp: any) => {
    kp = newkp;
  };
  //
  const preloadModel = async () => {
    await tf.setBackend("webgl");
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: "tfjs", // or 'tfjs'
      modelType: "full",
    };

    const detector = await poseDetection.createDetector(model, detectorConfig);

    setInterval(() => {
      detectPose(detector);
    }, 100);
  };

  const detectPose = async (detector: poseDetection.PoseDetector) => {
    // check camera is ready
    if (
      webRef.current !== null &&
      webRef.current?.video?.readyState === 4 &&
      detector !== null
    ) {
      const video = webRef.current.video as HTMLVideoElement;
      const poses = await detector.estimatePoses(video);

      updatekp(poses);
    }
  };

  useEffect(() => {
    window.onload = () => {
      preloadModel();
    };
  }, []);

  const videoConstraints = {
    height: dimension.height,
    width: dimension.width,
    facingMode: "user",
  };

  return (
    <div
      className="cameraContainer"
      style={{
        width: dimension.width,
        height: dimension.height,
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Webcam
        ref={webRef}
        audio={false}
        height={dimension.height}
        width={dimension.width}
        videoConstraints={videoConstraints}
      />
      <Canvas getkp={getkp} />
    </div>
  );
}

export default Camera;
