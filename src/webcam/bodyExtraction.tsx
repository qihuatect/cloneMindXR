import { Dimension, typeDimension } from "../helper";
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";

import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";
import { json } from "stream/consumers";
import Canvas from "../3Dscene";
import { draw } from "@tensorflow/tfjs-core/dist/ops/browser";
// Uncomment the line below if you want to use TensorFlow.js runtime.
// import '@tensorflow/tfjs-converter';

// Uncomment the line below if you want to use MediaPipe runtime.
// import '@mediapipe/selfie_segmentation';

function Camera() {
  const dimension = Dimension() as typeDimension;
  const webRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let kp: any = null;
  let maskPoint: any = null;
  const getkp = () => {
    return kp;
  };

  const updatekp = (newkp: any) => {
    kp = newkp;
  };
  //

  const getMaskPoint = () => {
    return maskPoint;
  };

  const preloadModel = async () => {
    await tf.setBackend("webgl");

    const segmenter = await bodyPix.load();

    // 3d pose estimation
    const model_pose = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: "tfjs", // or 'tfjs'
      modelType: "full",
    };

    const detector = await poseDetection.createDetector(
      model_pose,
      detectorConfig
    );

    setInterval(() => {
      detectPose(segmenter, detector);
    }, 100);
  };

  const detectPose = async (
    segmenter: bodyPix.BodyPix,
    detector: poseDetection.PoseDetector
  ) => {
    // check camera is ready
    if (
      webRef.current !== null &&
      webRef.current?.video?.readyState === 4 &&
      segmenter !== null &&
      detector !== null
    ) {
      const video = webRef.current.video as HTMLVideoElement;

      // body segmentation
      const segmentation = await segmenter.segmentPersonParts(video, {});

      const poses = await detector.estimatePoses(video);

      updatekp(poses);

      let canvas = canvasRef.current as HTMLCanvasElement;
      let colored = bodyPix.toMask(
        segmentation,
        { r: 0, g: 0, b: 0, a: 255 },
        { r: 255, g: 255, b: 255, a: 255 },
        false,
        [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23,
        ]
      );

      bodyPix.drawMask(canvas, video, colored, 1, 0, false);

      // let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      // video draw to canvas
      // ctx.drawImage(video, 0, 0, dimension.width, dimension.height);

      // let canvasImgData = ctx.getImageData(
      //   0,
      //   0,
      //   dimension.width,
      //   dimension.height
      // );

      // for (let i = 0; i < colored.data.length; i += 4) {
      //   if (
      //     colored.data[i] === 0 &&
      //     colored.data[i + 1] === 0 &&
      //     colored.data[i + 2] === 0
      //   ) {
      //     canvasImgData.data[i + 3] = 0;
      //     canvasImgData.data[i] = 0;
      //     canvasImgData.data[i + 1] = 0;
      //     canvasImgData.data[i + 2] = 0;
      //   }
      // }

      // ctx.putImageData(canvasImgData, 0, 0);
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
    // front camera
    facingMode: "environment",
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

      <Canvas getkp={getkp} canvasRef={canvasRef} getMaskPoint={getMaskPoint} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          zIndex: -100,
          opacity: 1,
          left: 0,
          top: 0,
        }}
      />
    </div>
  );
}

export default Camera;
