import { GRAVITATIONAL_CONSTANT } from "./matter/constants";

export function getCircularReplacer() {
  const ancestors: any[] = [];
  return function (this: any, key: any, value: any) {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return "[Circular]";
    }
    ancestors.push(value);
    return value;
  };
}
export function ClampToRange(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Function to convert a value from one range to another, preserving ratio.
 *
 * @param {number} newMin - the minimum value of the new range
 * @param {number} newMax - the maximum value of the new range
 * @param {number} oldValue - the value to be converted
 * @param {number} [oldMin] - the minimum value of the old range, default is 0
 * @param {number} [oldMax] - the maximum value of the old range, default is 1
 */
export function shiftValueToRange(
  newMin: number,
  newMax: number,
  oldValue: number,
  oldMin: number = 0,
  oldMax: number = 1,
) {
  return ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

export function getPointOnCircle(radius: number, angle: number) {
  return {
    x: radius * Math.cos((Math.PI * 2 * angle) / 360),
    y: radius * Math.sin((Math.PI * 2 * angle) / 360),
  };
}
export function getRadiusFromPoints(
  x: number,
  y: number,
  h: number,
  k: number,
) {
  return Math.sqrt((x - h) ** 2 + (y - k) ** 2);
}

export function getOrbitalVelocity(
  centerMass: number,
  orbitingMass: number,
  radius: number,
) {
  //return Math.sqrt((6.674 * Math.pow(10, -2) * mass) / radius);
  //return Math.sqrt((mass * 0.2777) / radius); //* 0.527;
  //return Math.sqrt(((centerMass + orbitingMass) * 1.854) / radius); G,
  return Math.sqrt(
    ((centerMass + orbitingMass) * GRAVITATIONAL_CONSTANT * 277.961) / radius,
  );
}

export function objectToFlatArray<T>(obj: any): T[] {
  const flatArray: any[] = [];
  for (const key in obj) {
    if (obj[key] instanceof Array) {
      obj[key].forEach((element: any) => flatArray.push(element));
    }
    if (obj.hasOwnProperty(key)) {
      flatArray.push(obj[key]);
    }
  }
  return flatArray;
}

/**
 * Standard Normal variate using Box-Muller transform.
 *
 * @param {number} [mean] - desired mean
 * @param {number} [stdev] - desired standard deviation
 * @returns {number} a random number with normal distribution over mean and stdev
 */
export function gaussianRandom(mean: number = 0, stdev: number = 1): number {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}
