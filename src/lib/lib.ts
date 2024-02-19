export function getCircularReplacer() {
  const ancestors: any[] = [];
  return function (key: any, value: any) {
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
