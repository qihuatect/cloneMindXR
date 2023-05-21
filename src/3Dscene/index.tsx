import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Dimension, typeDimension } from "../helper";
import * as THREE from "three";
function Box(props: any) {
  const { getkp, _point } = props;
  // This reference will give us direct access to the mesh
  const mesh = useRef<any>();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const dimension = Dimension() as typeDimension;
  // Rotate mesh every frame, this is outside of React without overhead

  useFrame(() => {
    let kp = getkp();
    if (kp !== null) {
      try {
        let point = kp[0].keypoints[_point];
        let point3d = kp[0].keypoints3D[_point];

        let _x = (point.x - dimension.width / 2) / 100;
        let _y = (point.y - dimension.height / 2) / 100;

        let diff_x = Math.abs((point3d.x - _x) / _x);
        let diff_y = Math.abs((point3d.y - _y) / _y);

        mesh.current.position.x = point3d.x * 5;
        mesh.current.position.y = point3d.y * -1 * 5;
        mesh.current.position.z = point3d.z * 4;
      } catch (err) {}
    }
  });
  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial />
    </mesh>
  );
}

export default function App(props: any) {
  const { getkp, canvasRef, getMaskPoint } = props;
  const dimension = Dimension() as typeDimension;

  return (
    <section
      style={{
        width: dimension.width,
        height: dimension.height,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {/* set renderer format rgbaformat*/}

      <Canvas>
        {/* <group position={[0, 0, 0]}>
          {new Array(21).fill(0).map((_, i) => (
            <Box key={i} getkp={getkp} _point={i} />
          ))}
        </group> */}

        {/* add envlight */}
        <ambientLight intensity={0.5} />
        <ControlGl />

        <Suspense fallback={null}>
          <PlaneMesh
            getkp={getkp}
            canvasRef={canvasRef}
            getMaskPoint={getMaskPoint}
          />
        </Suspense>

        <Box2 />
        <OrbitControls />
      </Canvas>
    </section>
  );
}

const Box2 = (props: any) => {
  const mesh = useRef<any>();
  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;

    mesh.current.position.z = Math.sin(mesh.current.rotation.x) * 5 - 4;
  });
  return (
    <mesh position={[-5, -5, -10]} ref={mesh}>
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
};

const ControlGl = () => {
  const { camera, gl } = useThree();

  return null;
};

const PlaneMesh = (props: any) => {
  const { getkp, canvasRef, getMaskPoint } = props;
  const dimension = Dimension() as typeDimension;
  const kp = getkp();
  const maskPoint = getMaskPoint();
  const textureRef = useRef<any>();
  const canvas = canvasRef.current as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;
  canvas.width = dimension.width;
  canvas.height = dimension.height;

  useFrame(() => {
    // update texture
    textureRef.current.needsUpdate = true;
  });

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[dimension.width / 10, dimension.height / 10]} />
      {canvasRef?.current !== null && (
        <meshBasicMaterial alphaTest={0.5} transparent opacity={1}>
          <canvasTexture
            attach="map"
            image={canvasRef.current}
            ref={textureRef}
          />
        </meshBasicMaterial>
      )}
    </mesh>
  );
};
