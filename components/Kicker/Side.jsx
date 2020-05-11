import React from 'react';
import * as THREE from 'three';

import config from '../../config';

// TODO: export a function component returning a mesh with a geometry:

const Side = ({ name, points, offset }) => {
  const rectShape = new THREE.Shape();
  rectShape.moveTo(points[0][0], points[0][1]);
  for (let i = 1, l = points.length; i < l; i++) {
    rectShape.lineTo(points[i][0], points[i][1]);
  }
  const extrudeSettings = {
    depth: config.model3d.sides.thickness,
    bevelSize: 0,
    bevelSegments: 1,
    bevelThickness: 0
  };
  const geometry = new THREE.ExtrudeGeometry(rectShape, extrudeSettings);

  // Utils.setupUVMapping(geometry);

  // Compensate for the extrusion amount, and move the whole shape by offset.
  let delta = new THREE.Vector3();
  delta.z = - config.model3d.sides.thickness / 2;
  delta = delta.add(offset);
  geometry.vertices.forEach(function(vertex) {
    vertex.add(delta);
  });

  return (
    <mesh geometry={geometry} name={name}>
      <meshStandardMaterial attach="material" color="blue"/>
    </mesh>
  )

};

export default Side;
