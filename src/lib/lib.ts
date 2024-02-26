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

export function memoize<T>(fn: () => T) {
  const cache = new Map();

  return function (this: any, ...args: any) {
    const key = JSON.stringify(args);

    if (cache.has(key)) return cache.get(key);

    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  };
}

export function thisTester(this: any) {
  console.log("Testing this context", this);
}
