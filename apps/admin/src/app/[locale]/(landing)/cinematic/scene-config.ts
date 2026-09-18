export type Vec3 = [number, number, number];

export type SceneKeyframe = {
  progress: number;
  cameraPosition: Vec3;
  cameraTarget: Vec3;
  packagePosition: Vec3;
  packageRotation: Vec3;
  containerPosition: Vec3;
  shipPosition: Vec3;
  truckPosition: Vec3;
  cranePosition: Vec3;
  fogDensity: number;
  lightIntensity: number;
};

export const SCENE_KEYFRAMES: SceneKeyframe[] = [
  {
    progress: 0,
    cameraPosition: [6.4, 3.2, 10.5],
    cameraTarget: [1.1, 0.2, 0],
    packagePosition: [2.2, -0.35, 0.4],
    packageRotation: [0.04, -0.32, 0],
    containerPosition: [-3.4, -0.7, -3.7],
    shipPosition: [-8, -1.8, -11],
    truckPosition: [13, -1.05, 1],
    cranePosition: [-6.5, -0.9, -6],
    fogDensity: 0.016,
    lightIntensity: 3.1,
  },
  {
    progress: 0.14,
    cameraPosition: [4.2, 2.1, 7.2],
    cameraTarget: [1.2, 0.1, 0],
    packagePosition: [1.2, -0.2, 0.3],
    packageRotation: [0.05, 0.75, 0.02],
    containerPosition: [-2.8, -0.75, -3.1],
    shipPosition: [-7, -1.7, -10],
    truckPosition: [12, -1.05, 0],
    cranePosition: [-5.5, -0.9, -5.2],
    fogDensity: 0.021,
    lightIntensity: 2.8,
  },
  {
    progress: 0.29,
    cameraPosition: [6.8, 2.6, 9.6],
    cameraTarget: [-0.5, 0, -2],
    packagePosition: [-1.9, -0.33, -2.2],
    packageRotation: [0, 1.45, 0],
    containerPosition: [-1.8, -0.65, -2.8],
    shipPosition: [-5.5, -1.65, -8.5],
    truckPosition: [11, -1.05, 0],
    cranePosition: [-4.6, -0.9, -4.7],
    fogDensity: 0.019,
    lightIntensity: 3.2,
  },
  {
    progress: 0.43,
    cameraPosition: [9.2, 4.5, 12.5],
    cameraTarget: [-1.8, -0.2, -5.5],
    packagePosition: [-1.9, -0.15, -3],
    packageRotation: [0, 1.55, 0],
    containerPosition: [-1.8, 1.65, -6.1],
    shipPosition: [-2.2, -1.7, -8.2],
    truckPosition: [10, -1.05, 0],
    cranePosition: [-3.8, -0.9, -5.8],
    fogDensity: 0.025,
    lightIntensity: 2.7,
  },
  {
    progress: 0.58,
    cameraPosition: [8.8, 7.4, 11.4],
    cameraTarget: [0.5, -1, -7.5],
    packagePosition: [-1.8, -0.3, -6],
    packageRotation: [0, 1.55, 0],
    containerPosition: [-0.8, 0.2, -7.5],
    shipPosition: [0.3, -1.6, -7.4],
    truckPosition: [10, -1.05, 0],
    cranePosition: [-8.5, -0.9, -7.5],
    fogDensity: 0.033,
    lightIntensity: 2.15,
  },
  {
    progress: 0.72,
    cameraPosition: [7.5, 3.9, 10.8],
    cameraTarget: [0.2, -0.4, -5],
    packagePosition: [-1.8, -0.3, -6],
    packageRotation: [0, 1.55, 0],
    containerPosition: [1.1, 1.4, -5.2],
    shipPosition: [-0.6, -1.65, -6.9],
    truckPosition: [7.7, -1.05, -2.2],
    cranePosition: [2.9, -0.9, -5.3],
    fogDensity: 0.021,
    lightIntensity: 3.25,
  },
  {
    progress: 0.86,
    cameraPosition: [7.8, 2.8, 9.8],
    cameraTarget: [0.8, -0.3, -1.3],
    packagePosition: [5.5, -0.3, -1.5],
    packageRotation: [0, 2.2, 0],
    containerPosition: [5.9, -0.6, -2.1],
    shipPosition: [-9, -1.8, -11],
    truckPosition: [1.1, -1.05, -1.1],
    cranePosition: [7.5, -0.9, -6.4],
    fogDensity: 0.017,
    lightIntensity: 3.5,
  },
  {
    progress: 1,
    cameraPosition: [5.2, 2.4, 7.5],
    cameraTarget: [0.4, 0, 0],
    packagePosition: [0.45, -0.15, 0.2],
    packageRotation: [0.05, 2.8, 0.02],
    containerPosition: [7, -0.7, -5],
    shipPosition: [-11, -1.8, -12],
    truckPosition: [6.5, -1.05, -2],
    cranePosition: [9, -0.9, -7],
    fogDensity: 0.012,
    lightIntensity: 3.1,
  },
];

export const JOURNEY_STEPS = [
  {
    id: 'prepare',
    number: '01',
    title: 'Prepared with precision',
    description: 'Every shipment starts with verified dimensions, secure packaging, and intelligent route planning.',
    labels: ['Package verified', 'Route optimized', 'Label generated'],
    align: 'left' as const,
  },
  {
    id: 'container',
    number: '02',
    title: 'Smarter container loading',
    description: 'ShipSmart coordinates cargo capacity, documentation, and departure schedules from one connected platform.',
    labels: ['Capacity matched', 'Documents synced', 'Departure secured'],
    align: 'right' as const,
  },
  {
    id: 'ocean',
    number: '03',
    title: 'Global reach without complexity',
    description: 'Coordinate international shipments across reliable ocean, air, and road transport networks.',
    labels: ['Tashkent', 'Dubai', 'Rotterdam'],
    align: 'left' as const,
  },
  {
    id: 'visible',
    number: '04',
    title: 'Every movement, visible',
    description: 'Follow your shipment from departure to arrival with live milestones and clear delivery updates.',
    labels: ['Container loaded', 'In transit', 'Port arrival'],
    align: 'right' as const,
  },
  {
    id: 'checkpoint',
    number: '05',
    title: 'Connected at every checkpoint',
    description: 'Customs, port operations, and local delivery teams stay synchronized throughout the journey.',
    labels: ['Customs cleared', 'Port synchronized', 'Handoff ready'],
    align: 'left' as const,
  },
  {
    id: 'delivery',
    number: '06',
    title: 'From the port to the front door',
    description: 'Flexible last-mile delivery keeps your shipment moving until the final handoff.',
    labels: ['Truck dispatched', 'Route live', 'Driver connected'],
    align: 'right' as const,
  },
  {
    id: 'complete',
    number: '07',
    title: 'Delivered. Tracked. Complete.',
    description: 'One connected experience for every stage of your shipment.',
    labels: ['Delivered', 'Proof captured', 'Journey complete'],
    align: 'left' as const,
  },
];

export function interpolateKeyframes(progress: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  let nextIndex = SCENE_KEYFRAMES.findIndex((frame) => frame.progress >= clamped);
  if (nextIndex <= 0) return { from: SCENE_KEYFRAMES[0], to: SCENE_KEYFRAMES[0], t: 0 };
  if (nextIndex === -1) nextIndex = SCENE_KEYFRAMES.length - 1;

  const from = SCENE_KEYFRAMES[nextIndex - 1];
  const to = SCENE_KEYFRAMES[nextIndex];
  const range = Math.max(0.0001, to.progress - from.progress);
  const t = (clamped - from.progress) / range;
  const smooth = t * t * (3 - 2 * t);

  return { from, to, t: smooth };
}
