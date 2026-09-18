'use client';

/* eslint-disable react/no-unknown-property -- React Three Fiber intrinsic elements */

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Line, Sky } from '@react-three/drei';
import type { DirectionalLight, FogExp2, Group } from 'three';
import * as THREE from 'three';
import {
  CargoShipModel,
  ContainerModel,
  DeliveryTruckModel,
  Ocean,
  PackageModel,
  PortCraneModel,
  PortEnvironment,
} from './scene-models';
import { interpolateKeyframes, type SceneKeyframe, type Vec3 } from './scene-config';

type ShipSmartCanvasProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
  mobile: boolean;
  onReady?: () => void;
};

function mixVec(from: Vec3, to: Vec3, t: number, target: THREE.Vector3) {
  target.set(
    THREE.MathUtils.lerp(from[0], to[0], t),
    THREE.MathUtils.lerp(from[1], to[1], t),
    THREE.MathUtils.lerp(from[2], to[2], t)
  );
}

function mixNumber(
  from: SceneKeyframe,
  to: SceneKeyframe,
  key: 'fogDensity' | 'lightIntensity',
  t: number
) {
  return THREE.MathUtils.lerp(from[key], to[key], t);
}

function ScrollScene({ progressRef, reducedMotion, mobile, onReady }: ShipSmartCanvasProps) {
  const packageRef = useRef<Group>(null);
  const containerRef = useRef<Group>(null);
  const shipRef = useRef<Group>(null);
  const craneRef = useRef<Group>(null);
  const truckRef = useRef<Group>(null);
  const routeRef = useRef<Group>(null);
  const scannerRef = useRef<
    THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
  >(null);
  const successRef = useRef<Group>(null);
  const fogRef = useRef<FogExp2>(null);
  const sunRef = useRef<DirectionalLight>(null);
  const { camera, pointer } = useThree();
  const temp = useMemo(
    () => ({
      camera: new THREE.Vector3(),
      target: new THREE.Vector3(),
      package: new THREE.Vector3(),
      rotation: new THREE.Vector3(),
      container: new THREE.Vector3(),
      ship: new THREE.Vector3(),
      truck: new THREE.Vector3(),
      crane: new THREE.Vector3(),
    }),
    []
  );

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useFrame((state, delta) => {
    if (document.visibilityState === 'hidden') return;

    const rawProgress = progressRef.current;
    const progress = reducedMotion
      ? Math.round(rawProgress * 7) / 7
      : rawProgress;
    const { from, to, t } = interpolateKeyframes(progress);
    const damping = 1 - Math.pow(0.002, Math.min(delta, 0.05));

    mixVec(from.cameraPosition, to.cameraPosition, t, temp.camera);
    mixVec(from.cameraTarget, to.cameraTarget, t, temp.target);
    mixVec(from.packagePosition, to.packagePosition, t, temp.package);
    mixVec(from.packageRotation, to.packageRotation, t, temp.rotation);
    mixVec(from.containerPosition, to.containerPosition, t, temp.container);
    mixVec(from.shipPosition, to.shipPosition, t, temp.ship);
    mixVec(from.truckPosition, to.truckPosition, t, temp.truck);
    mixVec(from.cranePosition, to.cranePosition, t, temp.crane);

    const cursorStrength = mobile || reducedMotion ? 0 : (1 - Math.min(1, progress * 2.5)) * 0.22;
    temp.camera.x += pointer.x * cursorStrength;
    temp.camera.y += pointer.y * cursorStrength * 0.55;

    camera.position.lerp(temp.camera, damping);
    camera.lookAt(temp.target);

    packageRef.current?.position.lerp(temp.package, damping);
    if (packageRef.current) {
      packageRef.current.rotation.x = THREE.MathUtils.lerp(packageRef.current.rotation.x, temp.rotation.x, damping);
      packageRef.current.rotation.y = THREE.MathUtils.lerp(packageRef.current.rotation.y, temp.rotation.y, damping);
      packageRef.current.rotation.z = THREE.MathUtils.lerp(packageRef.current.rotation.z, temp.rotation.z, damping);
      packageRef.current.position.y += reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.4) * 0.018;
    }

    containerRef.current?.position.lerp(temp.container, damping);
    shipRef.current?.position.lerp(temp.ship, damping);
    craneRef.current?.position.lerp(temp.crane, damping);
    truckRef.current?.position.lerp(temp.truck, damping);

    if (shipRef.current) {
      shipRef.current.rotation.y = THREE.MathUtils.lerp(shipRef.current.rotation.y, 0.08 + progress * 0.24, damping);
      shipRef.current.rotation.z = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.75) * 0.012;
    }

    if (truckRef.current) {
      const roadProgress = THREE.MathUtils.smoothstep(progress, 0.72, 0.94);
      truckRef.current.rotation.y = THREE.MathUtils.lerp(-0.2, 0.15, roadProgress);
    }

    if (routeRef.current) {
      const routeProgress = THREE.MathUtils.smoothstep(progress, 0.43, 0.69);
      routeRef.current.scale.x = Math.max(0.001, routeProgress);
      routeRef.current.visible = progress > 0.4 && progress < 0.78;
    }

    if (scannerRef.current) {
      const scan = THREE.MathUtils.smoothstep(progress, 0.05, 0.17);
      scannerRef.current.visible = progress > 0.03 && progress < 0.2;
      scannerRef.current.position.x = THREE.MathUtils.lerp(-1.2, 1.2, scan);
      scannerRef.current.material.opacity = Math.sin(scan * Math.PI) * 0.55;
    }

    if (successRef.current) {
      const success = THREE.MathUtils.smoothstep(progress, 0.91, 0.99);
      successRef.current.visible = progress > 0.9;
      successRef.current.scale.setScalar(Math.max(0.001, success));
      successRef.current.rotation.z += reducedMotion ? 0 : delta * 0.18;
    }

    if (fogRef.current) fogRef.current.density = mixNumber(from, to, 'fogDensity', t);
    if (sunRef.current) sunRef.current.intensity = mixNumber(from, to, 'lightIntensity', t);
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#d9e8f4', 0.016]} />
      <hemisphereLight args={['#ddecff', '#536271', 1.45]} />
      <directionalLight
        ref={sunRef}
        castShadow={!mobile}
        position={[8, 12, 8]}
        intensity={3.1}
        color="#fff2dc"
        shadow-mapSize-width={mobile ? 512 : 1024}
        shadow-mapSize-height={mobile ? 512 : 1024}
        shadow-camera-far={40}
      />
      <directionalLight position={[-8, 4, 5]} intensity={1.25} color="#67b9ff" />
      <Sky distance={450000} sunPosition={[7, 3, 4]} inclination={0.49} azimuth={0.22} turbidity={5.2} rayleigh={1.1} mieCoefficient={0.008} mieDirectionalG={0.76} />

      <PortEnvironment />
      <Ocean />
      <PackageModel ref={packageRef} />
      <ContainerModel ref={containerRef} />
      <CargoShipModel ref={shipRef} />
      <PortCraneModel ref={craneRef} />
      <DeliveryTruckModel ref={truckRef} />

      <mesh ref={scannerRef} position={[0, 0.2, 0.9]}>
        <boxGeometry args={[0.08, 2.2, 0.05]} />
        <meshBasicMaterial color="#41d9ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
      </mesh>

      <group ref={routeRef} position={[-3.5, 1.9, -5.4]} scale={[0.001, 1, 1]}>
        <Line
          points={[
            [0, 0, 0],
            [2.2, 1.2, -0.4],
            [4.7, 0.2, -0.9],
            [7.2, 1.5, -1.2],
            [10, 0.4, -1.8],
          ]}
          color="#41d9ff"
          lineWidth={2.2}
          transparent
          opacity={0.82}
        />
        {[0, 2.2, 4.7, 7.2, 10].map((x, index) => (
          <mesh key={x} position={[x, index % 2 ? 1.2 : index === 3 ? 1.5 : 0.2, -index * 0.32]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#f7f9fc" />
          </mesh>
        ))}
      </group>

      <group ref={successRef} position={[0.4, 1.8, 0]} visible={false}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.65, 0.055, 16, 64]} />
          <meshBasicMaterial color="#1fbe70" />
        </mesh>
        <mesh position={[-0.17, 0, 0.02]} rotation={[0, 0, -0.68]}>
          <boxGeometry args={[0.08, 0.42, 0.08]} />
          <meshBasicMaterial color="#1fbe70" />
        </mesh>
        <mesh position={[0.16, 0.1, 0.02]} rotation={[0, 0, 0.72]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshBasicMaterial color="#1fbe70" />
        </mesh>
      </group>

      {!mobile ? (
        <ContactShadows position={[0, -1.57, 0]} opacity={0.22} scale={22} blur={2.8} far={9} frames={1} />
      ) : null}
    </>
  );
}

export default function ShipSmartCanvas(props: ShipSmartCanvasProps) {
  return (
    <Canvas
      shadows={!props.mobile}
      dpr={props.mobile ? [0.75, 1.15] : [1, 1.6]}
      camera={{ fov: props.mobile ? 48 : 42, near: 0.1, far: 160, position: [6.4, 3.2, 10.5] }}
      gl={{ antialias: !props.mobile, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.55 }}
    >
      <Suspense fallback={null}>
        <ScrollScene {...props} />
      </Suspense>
    </Canvas>
  );
}
