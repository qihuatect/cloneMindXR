import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Dimension, typeDimension } from "../helper";
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
      console.log(kp);
      try {
        let point = kp[0].keypoints[_point];
        let point3d = kp[0].keypoints3D[_point];

        let _x = (point.x - dimension.width / 2) / 100;
        let _y = (point.y - dimension.height / 2) / 100;

        let diff_x = Math.abs((point3d.x - _x) / _x);
        let diff_y = Math.abs((point3d.y - _y) / _y);

        console.log(diff_x, diff_y);

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
  const { getkp } = props;
  const dimension = Dimension() as typeDimension;
  const kp = getkp();

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
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <group position={[0, 0, 0]}>
          {new Array(21).fill(0).map((_, i) => (
            <Box key={i} getkp={getkp} _point={i} />
          ))}
        </group>
        <OrbitControls />
      </Canvas>
    </section>
  );
}
