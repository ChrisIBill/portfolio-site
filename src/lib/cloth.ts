import {
  Bodies,
  Body,
  Common,
  Composites,
  Composite,
  IBodyDefinition,
} from "matter-js";
/**
 * Creates a simple cloth like object.
 * @method cloth
 * @param {number} xx
 * @param {number} yy
 * @param {number} columns
 * @param {number} rows
 * @param {number} columnGap
 * @param {number} rowGap
 * @param {boolean} crossBrace
 * @param {number} particleRadius
 * @param {} particleOptions
 * @param {} constraintOptions
 * @return {composite} A new composite cloth
 */
function cloth(
  xx: number,
  yy: number,
  columns: number,
  rows: number,
  columnGap: number,
  rowGap: number,
  crossBrace: boolean,
  particleRadius: number,
  particleOptions: any,
  constraintOptions: any,
): Composite {
  var group = Body.nextGroup(true);
  particleOptions = Common.extend(
    {
      inertia: Infinity,
      friction: 0.00001,
      collisionFilter: { group: group },
      render: { visible: false },
    },
    particleOptions,
  );
  constraintOptions = Common.extend(
    { stiffness: 0.06, render: { type: "line", anchors: false } },
    constraintOptions,
  );

  var cloth = Composites.stack(
    xx,
    yy,
    columns,
    rows,
    columnGap,
    rowGap,
    function (x, y) {
      return Bodies.circle(x, y, particleRadius, particleOptions);
    },
  );

  Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

  cloth.label = "Cloth Body";

  return cloth;
}

export default cloth;
