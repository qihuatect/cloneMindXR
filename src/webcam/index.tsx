import { Dimension, typeDimension } from "../helper";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { useEffect, useRef, useState } from "react";
// Uncomment the line below if you want to use TF.js runtime.
// import '@tensorflow/tfjs-backend-webgl';
// Uncomment the line below if you want to use MediaPipe runtime.
// import '@mediapipe/pose';

function Camera() {
  const dimension = Dimension() as typeDimension;
  const webRef = useRef<Webcam>(null);
  const [net, setNet] = useState<poseDetection.PoseDetector | null>(null);
  //
  const preloadModel = async () => {
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: "mediapipe", // or 'tfjs'
      modelType: "full",
    };

    const detector = await poseDetection.createDetector(model, detectorConfig);
    setNet(detector);
  };

  const detectPose = async () => {};

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
        videoConstraints={videoConstraints}
        mirrored={true}
      />
    </div>
  );
}

export default Camera;
