import React, { useRef, useState } from 'react'
import Head from 'next/head';
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import 'mobx-react-lite/batchingForReactDom';
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'drei';
import * as THREE from 'three';

import Kicker from '../components/Kicker';
import Slider from '../components/Slider';
import KickerModel from '../models/KickerModel';
import mapPoints from '../models/mapPoints.json';
import styles from '../styles/home.module.scss';

const title = 'React Kicker';
const kickerModel = new KickerModel();

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

const createMeshGeometry = (data, size, scaleVector) => {
  var geometry = new THREE.PlaneGeometry(1.0, 1.0, size - 1, size - 1);
  for (var x = 0; x < size; x++) {
    for (var z = 0; z < size; z++) {
      var vertexX = x / size * scaleVector.x;
      var vertexY = data[x][z]['z'] * scaleVector.y;
      var vertexZ = z / size * scaleVector.z;
      geometry.vertices[x + z * size] = new THREE.Vector3(
        vertexX,
        vertexY,
        vertexZ
      );
    }
  }

  geometry.vertices[0].y = 1000;

  // Offset all vertices so that the mesh is centered and flush with minY.
  geometry.computeBoundingBox();
  var boundingBox = geometry.boundingBox.clone();
  var xRange = boundingBox.max.x - boundingBox.min.x;
  var zRange = boundingBox.max.z - boundingBox.min.z;
  var offset = new THREE.Vector3(
    xRange / 2,
    0,
    zRange / 2);
  geometry.vertices.forEach(function(vertex) {
    vertex.sub(offset);
  });
  console.log({ geometry });
  return geometry;
}


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

function HeightMap(props) {
  const { scene } = useThree();
  window.scene = scene;
  if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
    __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', {detail: scene}));
  }
  console.log({scene});

  const mapGeometry = createMeshGeometry(mapPoints, mapPoints.length, new THREE.Vector3(5.0, 0.01, 5.0));
  return (

    <mesh
      {...props}
      name="heightMap"
      geometry={mapGeometry}
    >
      <meshStandardMaterial attach="material" color="green"/>
    </mesh>
  );
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

        <Canvas className={styles.canvas} style={{height: '500px'}}>
          <OrbitControls />
          <HeightMap position={[0, -2.5, 0]} name="heightMap" />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} name="toto" />
          <Box position={[1.2, 0, 0]} name="tata" />
          <Kicker angle={angle} radius={radius} width={width} />
        </Canvas>
      </main>
    </div>
  );
});

export default function Home() {
  return <Main appState={appState} />;
}
