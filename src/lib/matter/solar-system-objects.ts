import { collisionFilters } from "./constants";
import MatterAttractors from "matter-attractors";
import { gaussianRandom } from "@/lib/matter/lib";
import logger from "../pino";
import AstronomicalBody, { SolarObjectProps } from "./astronomicalBody";

const SolarBodiesLog = logger.child({ module: "Solar Bodies" });

export type BodyRef = Matter.Body | null;
export const SolarBodiesKeys = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "rocket",
  "moon",
  "earthSOI",
  "asteroids",
] as const;
export type ISolarBodiesKeys = (typeof SolarBodiesKeys)[number];

export type SolarBodies = {
  [key: string]: BodyRef | Matter.Body[];
  sun: BodyRef;
  mercury: BodyRef;
  venus: BodyRef;
  earth: BodyRef;
  rocket: BodyRef;
  moon: BodyRef;
  asteroids: Matter.Body[];
};

const SUN_PROPS: SolarObjectProps = {
  radius: 50,
  mass: 33300,
  label: "SUN",
  fillStyle: "yellow",
  sprite: "../../../public/sitemap.xml",
  isStatic: true,
  orbit: {
    semiMajorAxis: 0,
    periapsis: 0,
    apoapsis: 0,
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  },
} as const;

const MERCURY_PROPS = {
  radius: 4,
  label: "MERCURY",
  mass: 0.5, //0.05 earth
  fillStyle: "pink",
  orbit: {
    semiMajorAxis: 0.387098,
    periapsis: 0.307499,
    apoapsis: 0.466697,
  },
} as const;

const VENUS_PROPS: SolarObjectProps = {
  radius: 9.5,
  orbit: {
    semiMajorAxis: 0.723332,
    periapsis: 0.71844,
    apoapsis: 0.728213,
  },
  label: "VENUS",

  mass: 8.5, //0.85 earth
  fillStyle: "orange",
} as const;

const EARTH_PROPS: SolarObjectProps = {
  radius: 10,
  orbit: {
    semiMajorAxis: 1,
    periapsis: 0.9833,
    apoapsis: 1.0167,
  },
  mass: 10,
  label: "EARTH",
  fillStyle: "blue",
} as const;

const ROCKET_PROPS: SolarObjectProps = {
  radius: 2,
  orbit: {
    semiMajorAxis: 0,
    periapsis: 0,
    apoapsis: 0,
  },
  label: "ROCKET",
  mass: 0.000001,
  fillStyle: "black",
} as const;
const MOON_PROPS: SolarObjectProps = {
  radius: 2.5,
  orbit: {
    semiMajorAxis: 0.002569,
    apoapsis: 0.00271,
    periapsis: 0.002424,
  },
  label: "MOON",
  mass: 0.123,
  fillStyle: "white",
} as const;
const MARS_PROPS = {
  radius: 5,
  orbit: {
    semiMajorAxis: 1.5237,
    periapsis: 1.3814,
    apoapsis: 1.666,
  },
  label: "MARS",
  mass: 0.5,
  fillStyle: "red",
} as const;
const JUPITER_PROPS = {
  orbit: {
    semiMajorAxis: 5.2038,
    periapsis: 4.9506,
    apoapsis: 5.457,
  },
  radius: 30,
  label: "JUPITER",
  mass: 100,
  fillStyle: "orange",
} as const;
const SATURN_PROPS = {
  orbit: {
    semiMajorAxis: 9.5826,
    apoapsis: 10.1238,
    periapsis: 9.0412,
  },
  radius: 9.14,
  label: "SATURN",
  mass: 95.162,
  fillStyle: "yellow",
} as const;
const URANUS_PROPS = {
  orbit: {
    semiMajorAxis: 19.191,
    apoapsis: 20.0965,
    periapsis: 18.2861,
  },
  radius: 3.981,
  label: "URANUS",
  mass: 14.536,
  fillStyle: "blue",
} as const;
const NEPTUNE_PROPS = {
  orbit: {
    semiMajorAxis: 30.07,
    periapsis: 29.81,
    apoapsis: 30.33,
    direction: -1,
  },
  radius: 3.865,
  label: "NEPTUNE",
  mass: 17.147,
  fillStyle: "blue",
};

const genSolarBodies = {
  isStatic: false,
  friction: 0,
  frictionAir: 0,
  //frictionStatic: 0,
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

//const AU_SCALE = 149597870700;
const AU_SCALE = 1000;
//function generateAstronomicalBodies(
//  this: any,
//  bodyProps: SolarObjectProps,
//  parent?: Body,
//  centerPoint?: { x: number; y: number },
//) {
//  const AstronomicalBodiesLog = SolarBodiesLog.child({
//    function: "generateAstronomicalBodies",
//    astronomicalBody: bodyProps.label,
//  });
//  AstronomicalBodiesLog.debug({
//    message: "init",
//    label: bodyProps.label,
//    bodyProps,
//    parent,
//  });
//  const orbit = bodyProps.orbit as EllipticalOrbitProps;
//  const apoapsis = orbit.apoapsis! * AU_SCALE;
//  const periapsis = orbit.periapsis! * AU_SCALE;
//  const semiMajorAxis = orbit.semiMajorAxis! * AU_SCALE;
//  const orbitalRadius = getRandomArbitrary(apoapsis, periapsis);
//  const orbitalAngle = getRandomArbitrary(0, 360);
//  const orbitalPosition = getPointOnCircle(orbitalRadius, orbitalAngle);
//  const position = { x: 0, y: 0 };
//  if (parent) {
//    position.x = (parent.position.x + orbitalPosition.x) * distanceScale;
//    position.y = (parent.position.y + orbitalPosition.y) * distanceScale;
//  } else if (centerPoint) {
//    position.x = centerPoint.x;
//    position.y = centerPoint.y;
//  }
//  const mass = bodyProps.mass * massScale;
//  const stdGravParam = getStandardGravitationalParameter(
//    parent?.mass ?? 0,
//    bodyProps.mass,
//  );
//  let velocity =
//    orbitalRadius > 0
//      ? getEllipticalOrbitalVelocity(stdGravParam, orbitalRadius, semiMajorAxis)
//      : 0;
//  let dx =
//    -(velocity * orbitalPosition.y) / orbitalRadius + (parent?.velocity.x ?? 0);
//  dx = isNaN(dx) ? 0 : dx;
//  let dy =
//    (velocity * orbitalPosition.x) / orbitalRadius + (parent?.velocity.y ?? 0);
//  dy = isNaN(dy) ? 0 : dy;
//  const body = Bodies.circle(position.x, position.y, bodyProps.radius, {
//    ...genSolarBodies,
//    label: bodyProps.label,
//    mass: mass,
//    render: {
//      fillStyle: bodyProps.fillStyle,
//    },
//  });
//  AstronomicalBodiesLog.debug({
//    message: "Orbital Data",
//    orbitalRadius,
//    orbitalPosition,
//    velocity,
//    parentVelocity: parent?.velocity,
//    semiMajorAxis,
//    dx,
//    dy,
//    stdGravParam,
//  });
//  Body.setVelocity(body, { x: dx, y: dy });
//  AstronomicalBodiesLog.debug({
//    message: "Body Data",
//    body,
//  });
//  return {
//    body: body,
//    generateChildBodies: (args: SolarObjectProps) =>
//      generateAstronomicalBodies(args, body),
//  };
//}

export const solarSystemObjects = (cw: number, ch: number) => {
  const centerX = cw / 2,
    centerY = ch / 2;
  console.log("Center: ", centerX, centerY);

  const centerPoint = {
    x: centerX,
    y: centerY,
  };

  const sunProps = {
    ...SUN_PROPS,
    orbit: {
      ...SUN_PROPS.orbit,
      position: centerPoint,
    },
  };
  console.log("SUN_PROPS", sunProps);

  const SolarSystem = new AstronomicalBody({
    ...SUN_PROPS,
    orbit: {
      ...SUN_PROPS.orbit,
      position: { x: centerX, y: centerY },
    },
  });
  SolarSystem.generateChild(MERCURY_PROPS);
  SolarSystem.generateChild(VENUS_PROPS);
  const EarthSystem = SolarSystem.generateChild(EARTH_PROPS);
  EarthSystem.generateChild(MOON_PROPS);
  SolarSystem.generateChild(MARS_PROPS);
  SolarSystem.generateChild(JUPITER_PROPS);
  SolarSystem.generateChild(SATURN_PROPS);
  SolarSystem.generateChild(URANUS_PROPS);

  const generateAsteroid = (index: number) => {
    let apoapsis = gaussianRandom(3.5, 0.7);
    let periapsis = gaussianRandom(2.3, 0.4);
    const radius = (1 + Math.random() * 2) * 1;
    const mass = 0.0005 * radius ** 2;
    if (apoapsis < periapsis) {
      const temp = apoapsis;
      apoapsis = periapsis;
      periapsis = temp;
    }
    SolarSystem.generateChild({
      label: "asteroid" + index,
      mass: mass,
      radius: radius,
      fillStyle: "white",
      orbit: {
        semiMajorAxis: (apoapsis + periapsis) / 2,
        apoapsis: apoapsis,
        periapsis: periapsis,
      },
    });
  };
  for (let i = 0; i < 200; i++) {
    generateAsteroid(i);
  }
  // const rocket = Bodies.circle(0, 0, 0, {
  //   ...genSolarBodies,
  //   isStatic: false,
  // });

  return SolarSystem;
};
