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

export function getOrbitalVelocity(mass: number, radius: number) {
  //return Math.sqrt((6.674 * Math.pow(10, -2) * mass) / radius);
  return Math.sqrt((mass * 0.2777) / radius); //* 0.527;
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
