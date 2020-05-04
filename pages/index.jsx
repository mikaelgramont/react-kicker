import React, { useRef, useState } from 'react'
import Head from 'next/head';
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import 'mobx-react-lite/batchingForReactDom';
import { Canvas, useFrame } from 'react-three-fiber'

import Slider from '../components/Slider';
import Kicker from '../models/Kicker';
import styles from '../styles/home.module.scss';

const title = 'React Kicker';
const kickerModel = new Kicker();

const INITIAL_HEIGHT = 1.0;
const INITIAL_WIDTH = 1.2;
const INITIAL_ANGLE = 45;

const INITIAL_LENGTH = kickerModel.calculateLength(INITIAL_HEIGHT, INITIAL_ANGLE);
const INITIAL_RADIUS = kickerModel.calculateRadius(INITIAL_HEIGHT, INITIAL_ANGLE);
const INITIAL_ARC = kickerModel.calculateArc(INITIAL_RADIUS, INITIAL_ANGLE);

const appState = observable({
  angle: INITIAL_ANGLE,
  arc: INITIAL_ARC,
  height: INITIAL_HEIGHT,
  length: INITIAL_LENGTH,
  radius: INITIAL_RADIUS,
  width: INITIAL_WIDTH,
});

const updateCalculations = (appState) => {
  appState.length = kickerModel.calculateLength(appState.height, appState.angle);
  appState.radius = kickerModel.calculateRadius(appState.height, appState.angle);
  appState.arc = kickerModel.calculateArc(appState.radius, appState.angle);
};


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
  const { angle, arc, height, length, radius, width, } = appState;

  const onHeightChange = (e) => {
    appState.height = e.currentTarget.value;
    updateCalculations(appState);
  };

  const onWidthChange = (e) => { appState.width = e.currentTarget.value; };

  const onAngleChange = (e) => {
    appState.angle = e.currentTarget.value;
    updateCalculations(appState);
  };

  return (
    <div className="container">
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <h1 className="title">{title}</h1>

        <form>
          <div className={styles.input}>
            <Slider onChange={onHeightChange} className={styles.slider} label="height" id="height" name="height" step="0.1" min={0.5} max={3} value={height} />
            <Slider onChange={onWidthChange} className={styles.slider} label="width" id="width" name="width" step="0.1" min={0.5} max={3} value={width} />
            <Slider onChange={onAngleChange} className={styles.slider} label="angle" id="angle" name="angle" step="1" min={30} max={89} value={angle}/>
          </div>

          <output name="length" className={styles.output} htmlFor="height width angle">
            Length: { length }
          </output>
          <output name="length" className={styles.output} htmlFor="height width angle">
            Arc: { arc }
          </output>
          <output name="length" className={styles.output} htmlFor="height width angle">
            Radius: { radius }
          </output>
        </form>

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
