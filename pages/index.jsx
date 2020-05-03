import React, { useRef, useState } from 'react'
import Head from 'next/head';
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import 'mobx-react-lite/batchingForReactDom';
import { Canvas, useFrame } from 'react-three-fiber'

import Slider from '../components/Slider';
import styles from '../styles/home.module.scss';

const title = 'React Kicker';

const appState = observable({
  height: 1.0,
  width: 1.2,
  radius: 45,
});

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={e => setActive(!active)}
      onPointerOver={e => setHover(true)}
      onPointerOut={e => setHover(false)}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Main = observer(({ appState }) => {
  const { height, width, radius, } = appState;

  const onHeightChange = (e) => {appState.height = e.currentTarget.value; };
  const onWidthChange = (e) => { appState.width = e.currentTarget.value; };
  const onRadiusChange = (e) => { appState.radius = e.currentTarget.value; };

  return (
    <div className="container">
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <h1 className="title">{title}</h1>

        <div className={styles.input}>
          <Slider onChange={onHeightChange} className={styles.slider} label="height" id="height" name="height" min={0.5} max={3} value={height} />
          <Slider onChange={onWidthChange} className={styles.slider} label="width" id="width" name="width" min={0.5} max={3} value={width} />
          <Slider onChange={onRadiusChange} className={styles.slider} label="radius" id="radius" name="radius" min={30} max={89} value={radius}/>
        </div>

        <div className={styles.output}>

        </div>

        <Canvas className={styles.canvas}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
      </main>
    </div>
  );
});

export default function Home() {
  return <Main appState={appState} />;
}
