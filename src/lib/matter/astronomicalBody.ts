import MatterAttractors from "matter-attractors";

// import { Body } from "matter-js";
//
// interface SolarObjectProps extends Body {
//   offsetX: number;
//   offsetY: number;
//   x?: number;
//   y?: number;
//   orbit?: {
//     parent: SolarObjectProps;
//     radius: () => number;
//     semiMajorAxis: () => number;
//     velocity: () => number;
//   };
//   radius: number;
//   options: {
//     label: string;
//     mass: number;
//     render: {
//       fillStyle: string;
//     };
//   };
// }
//

const genSolarBodies = {
  isStatic: false,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
  collisionFilter: {
    category: collisionFilters.balls,
    mask:
      collisionFilters.balls |
      collisionFilters.mouse |
      collisionFilters.content,
  },
  plugin: {
    attractors: [MatterAttractors.Attractors.gravity],
  },
} as const;

interface IAstronomicalBodyProps {
  mass: number;
  label: string;
  color: string;
  radius: number;
  isStatic?: boolean;
  orbit: {
    semiMajorAxis: number;
    periapsis: number;
    apoapsis: number;
    radius?: number;
    position: number;
  };
}
// class AstronomicalBody {
//   mass: number;
//   periapsis: () => number;
//   apoapsis: () => number;
//   semiMajorAxis: () => number;
//   body: Body;
//   options: any;
//   velocity: () => Coordinates;
//   radius: number;
//   parent?: AstronomicalBody;
//   children?: AstronomicalBody[];
//
//   constructor(props: IAstronomicalBodyProps) {
//     this.getStandardGravitationalParameter
// }

import { collisionFilters } from "./constants";
import { Coordinates } from "../interfaces";

// }

const NULL_ASTRONOMICAL_BODY = {
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  mass: 0,
};
//const AU_SCALE = 149597870700;
const AU_SCALE = 1000;
function generateAstronomicalBodies(
  this: any,
  bodyProps: IAstronomicalBodyProps,
  parent: Body,
) {
  const AstronomicalBodiesLog = SolarBodiesLog.child({
    function: "generateAstronomicalBodies",
    astronomicalBody: bodyProps.options.label,
  });
  AstronomicalBodiesLog.debug({
    message: "init",
    label: bodyProps.options.label,
    bodyProps,
    parent,
  });
  const apoapsis = bodyProps.orbit.apoapsis * AU_SCALE;
  const periapsis = bodyProps.orbit.periapsis * AU_SCALE;
  const semiMajorAxis = bodyProps.orbit.semiMajorAxis * AU_SCALE;
  const orbitalRadius = getRandomArbitrary(apoapsis, periapsis);
  const orbitalPosition = getPointOnCircle(
    orbitalRadius,
    getRandomArbitrary(0, 360),
  );
  const position = {
    x: (parent.position.x + orbitalPosition.x) * distanceScale,
    y: (parent.position.y + orbitalPosition.y) * distanceScale,
  };
  const mass = bodyProps.options.mass * massScale;
  const stdGravParam = getStandardGravitationalParameter(
    parent.mass,
    bodyProps.options.mass,
  );

  const velocity =
    orbitalRadius > 0
      ? getEllipticalOrbitalVelocity(stdGravParam, orbitalRadius, semiMajorAxis)
      : 0;
  let dx = -(velocity * orbitalPosition.y) / orbitalRadius + parent.velocity.x;
  dx = isNaN(dx) ? 0 : dx;
  let dy = (velocity * orbitalPosition.x) / orbitalRadius + parent.velocity.y;
  dy = isNaN(dy) ? 0 : dy;
  const body = Bodies.circle(position.x, position.y, bodyProps.radius, {
    ...genSolarBodies,
    ...bodyProps.options,
    mass: mass,
  });
  AstronomicalBodiesLog.debug({
    message: "Orbital Data",
    orbitalRadius,
    orbitalPosition,
    velocity,
    parentVelocity: parent.velocity,
    dx,
    dy,
    stdGravParam,
  });
  Body.setVelocity(body, { x: dx, y: dy });
  AstronomicalBodiesLog.debug({
    message: "Body Data",
    body,
  });
  return {
    body: body,
    generateChildBodies: (args: SolarObjectProps) =>
      generateAstronomicalBodies(args, body),
  };
}
