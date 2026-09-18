'use client';

/* eslint-disable react/no-unknown-property -- React Three Fiber intrinsic elements */

import { forwardRef, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import type { Group } from 'three';

const BLUE = '#1769ff';
const NAVY = '#07111f';
const CYAN = '#41d9ff';

export const PackageModel = forwardRef<Group>(function PackageModel(_, ref) {
  return (
    <group ref={ref}>
      <RoundedBox args={[2.15, 1.55, 1.65]} radius={0.08} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#b98b55" roughness={0.82} metalness={0.02} />
      </RoundedBox>
      <mesh position={[0, 0.79, 0]} castShadow>
        <boxGeometry args={[0.18, 0.025, 1.66]} />
        <meshStandardMaterial color="#8d6338" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.08, 0.831]}>
        <planeGeometry args={[1.1, 0.62]} />
        <meshStandardMaterial color="#f7f9fc" roughness={0.55} />
      </mesh>
      <mesh position={[-0.37, 0.12, 0.842]}>
        <planeGeometry args={[0.22, 0.22]} />
        <meshStandardMaterial color={BLUE} roughness={0.45} />
      </mesh>
      <mesh position={[0.03, -0.18, 0.844]}>
        <planeGeometry args={[0.9, 0.05]} />
        <meshBasicMaterial color={NAVY} />
      </mesh>
    </group>
  );
});

export const ContainerModel = forwardRef<Group>(function ContainerModel(_, ref) {
  const ribs = useMemo(() => Array.from({ length: 12 }, (_, index) => -2.65 + index * 0.48), []);

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[5.7, 2.65, 2.65]} />
        <meshStandardMaterial color="#0b55b6" roughness={0.58} metalness={0.42} />
      </mesh>
      {ribs.map((x) => (
        <mesh key={x} position={[x, 0, 1.34]}>
          <boxGeometry args={[0.06, 2.42, 0.045]} />
          <meshStandardMaterial color="#4a91ef" roughness={0.48} metalness={0.42} />
        </mesh>
      ))}
      <mesh position={[0, 0, 1.375]}>
        <planeGeometry args={[1.1, 0.55]} />
        <meshStandardMaterial color="#f7f9fc" roughness={0.52} />
      </mesh>
      <mesh position={[-0.35, 0, 1.39]}>
        <circleGeometry args={[0.18, 24]} />
        <meshBasicMaterial color={BLUE} />
      </mesh>
    </group>
  );
});

export const CargoShipModel = forwardRef<Group>(function CargoShipModel(_, ref) {
  const containers = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      x: -2.8 + (i % 6) * 1.12,
      y: 0.05 + Math.floor(i / 12) * 0.7,
      z: -0.55 + (Math.floor(i / 6) % 2) * 1.05,
      color: [BLUE, '#d65d3c', '#ef9b32', '#0a4d8c'][i % 4],
    })),
    []
  );

  return (
    <group ref={ref} scale={0.82}>
      <mesh castShadow receiveShadow position={[0, -0.55, 0]} scale={[1, 0.62, 1]}>
        <boxGeometry args={[8.7, 2.2, 3.25]} />
        <meshStandardMaterial color="#081421" roughness={0.42} metalness={0.55} />
      </mesh>
      <mesh position={[0, -1.12, 0]} scale={[1, 0.28, 1]}>
        <boxGeometry args={[8.95, 1.3, 3.1]} />
        <meshStandardMaterial color="#a63c2e" roughness={0.58} metalness={0.32} />
      </mesh>
      <mesh position={[0, 0.48, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.18, 2.9]} />
        <meshStandardMaterial color="#e8eef5" roughness={0.5} metalness={0.2} />
      </mesh>
      {containers.map((item, index) => (
        <mesh key={index} position={[item.x, 0.92 + item.y, item.z]} castShadow>
          <boxGeometry args={[1, 0.62, 0.86]} />
          <meshStandardMaterial color={item.color} roughness={0.52} metalness={0.35} />
        </mesh>
      ))}
      <mesh position={[-3.25, 1.5, 0]} castShadow>
        <boxGeometry args={[1.2, 1.65, 2.35]} />
        <meshStandardMaterial color="#edf4fb" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[-3.25, 2.5, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 2.1, 12]} />
        <meshStandardMaterial color="#dce5ee" roughness={0.42} metalness={0.65} />
      </mesh>
    </group>
  );
});

export const PortCraneModel = forwardRef<Group>(function PortCraneModel(_, ref) {
  return (
    <group ref={ref} scale={0.88}>
      {[-1.45, 1.45].map((x) => (
        <mesh key={x} position={[x, 1.4, 0]} castShadow>
          <boxGeometry args={[0.28, 5.5, 0.32]} />
          <meshStandardMaterial color="#d7e0e9" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 4.05, 0]} castShadow>
        <boxGeometry args={[3.6, 0.3, 0.42]} />
        <meshStandardMaterial color="#d7e0e9" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[1.95, 4.05, -1.2]} rotation={[0, 0.58, 0]} castShadow>
        <boxGeometry args={[4.1, 0.22, 0.32]} />
        <meshStandardMaterial color="#e8eef5" roughness={0.4} metalness={0.68} />
      </mesh>
      <mesh position={[2.2, 2.8, -1.45]}>
        <boxGeometry args={[0.05, 2.4, 0.05]} />
        <meshBasicMaterial color="#343f4a" />
      </mesh>
    </group>
  );
});

export const DeliveryTruckModel = forwardRef<Group>(function DeliveryTruckModel(_, ref) {
  return (
    <group ref={ref} scale={0.95}>
      <mesh position={[0.65, 0.28, 0]} castShadow>
        <boxGeometry args={[3.3, 1.75, 1.75]} />
        <meshStandardMaterial color={BLUE} roughness={0.48} metalness={0.32} />
      </mesh>
      <mesh position={[-1.45, 0.1, 0]} castShadow>
        <boxGeometry args={[1.35, 1.45, 1.72]} />
        <meshStandardMaterial color="#eef5fc" roughness={0.42} metalness={0.25} />
      </mesh>
      <mesh position={[-1.58, 0.34, 0.87]}>
        <planeGeometry args={[0.75, 0.55]} />
        <meshPhysicalMaterial color="#173a68" roughness={0.14} metalness={0.25} transmission={0.05} />
      </mesh>
      {[-1.18, 1.25].map((x) =>
        [-0.82, 0.82].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.72, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.44, 0.44, 0.24, 24]} />
            <meshStandardMaterial color="#0a1018" roughness={0.82} metalness={0.2} />
          </mesh>
        ))
      )}
      <mesh position={[0.7, 0.28, 0.89]}>
        <planeGeometry args={[1.2, 0.55]} />
        <meshStandardMaterial color="#f7f9fc" roughness={0.52} />
      </mesh>
    </group>
  );
});

export function PortEnvironment() {
  const blocks = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    x: -8 + (i % 8) * 2.1,
    y: -1.65 + Math.floor(i / 8) * 0.72,
    z: -12 - Math.floor(i / 8) * 1.1,
    color: [BLUE, '#d75b3e', '#e89b31', '#0a4d8c'][i % 4],
  })), []);

  return (
    <group>
      <mesh position={[0, -1.75, -5]} receiveShadow>
        <boxGeometry args={[32, 0.3, 24]} />
        <meshStandardMaterial color="#bac7d3" roughness={0.92} metalness={0.04} />
      </mesh>
      {blocks.map((block, index) => (
        <mesh key={index} position={[block.x, block.y, block.z]} castShadow>
          <boxGeometry args={[1.85, 0.62, 0.9]} />
          <meshStandardMaterial color={block.color} roughness={0.6} metalness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

export function Ocean() {
  return (
    <group>
      <mesh position={[0, -1.62, -8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[48, 34, 48, 48]} />
        <meshPhysicalMaterial color="#0a4d8c" roughness={0.18} metalness={0.12} clearcoat={0.72} clearcoatRoughness={0.2} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, -1.58, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 18, 72]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.045} wireframe />
      </mesh>
    </group>
  );
}
