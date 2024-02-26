import { GRAVITATIONAL_CONSTANT } from "./constants";
import seedrandom from "seedrandom";
export function getOrbitalVelocity(
  centerMass: number,
  orbitingMass: number,
  radius: number,
) {
  //return Math.sqrt((6.674 * Math.pow(10, -2) * mass) / radius);
  //return Math.sqrt((mass * 0.2777) / radius); //* 0.527;
  //return Math.sqrt(((centerMass + orbitingMass) * 1.854) / radius); G,
  return Math.sqrt(
    ((centerMass + orbitingMass) * GRAVITATIONAL_CONSTANT * 277.777) / radius,
  );
}
export const getStandardGravitationalParameter = (
  centerMass: number,
  orbitingMass: number,
) => (centerMass + orbitingMass) * GRAVITATIONAL_CONSTANT * 277.777;
export function getEllipticalOrbitalVelocity(
  stdGravParam: number,
  radius: number,
  semiMajorAxis: number,
) {
  return Math.sqrt(stdGravParam * (2 / radius - 1 / semiMajorAxis));
}

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const seed = makeid(10);

export const seededRng = seedrandom(seed);

export function getRandomArbitrary(min: number, max: number) {
  return seededRng() * (max - min) + min;
}
export function gaussianRandom(mean: number = 0, stdev: number = 1): number {
  const u = 1 - seededRng(); // Converting [0,1) to (0,1]
  const v = seededRng();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

export interface IOrbitData {}
export function generateOrbitData(radius: number, semiMajorAxis: number) {}
