import { Bodies, Body, Constraint } from "matter-js";
import { getPointOnCircle, getVectorMagnitude } from "../geometry/lib";
import {
  getEllipticalOrbitalVelocity,
  getOrbitalVelocity,
  getRandomArbitrary,
  getStandardGravitationalParameter,
} from "@/lib/matter/lib";
import { collisionFilters } from "./constants";
import MatterAttractors from "matter-attractors";
import { gaussianRandom } from "@/lib/matter/lib";
import logger from "../pino";

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

const SYSTEM_SCALE = 1;
const distanceScale = SYSTEM_SCALE;
const massScale = Math.sqrt(SYSTEM_SCALE);
//const orbitScale = 0.6;
//const massScale = 1;

const ORBITAL_RADIUS_SCALE = 0.6;

export type SolarBodies = {
  [key: string]: BodyRef | Matter.Body[];
  sun: BodyRef;
  mercury: BodyRef;
  venus: BodyRef;
  earth: BodyRef;
  rocket: BodyRef;
  //earthSOI: BodyRef;
  moon: BodyRef;
  asteroids: Matter.Body[];
};

interface SolarObjectProps {
  offsetX: number;
  offsetY: number;
  x?: number;
  y?: number;
  orbit: {
    semiMajorAxis: number;
    apoapsis: number;
    periapsis: number;
    radius?: number;
    velocity?: {};
  };
  radius: number;
  options: {
    label: string;
    mass: number;
    render: {
      fillStyle: string;
    };
  };
  velocity?: {
    x: number;
    y: number;
  };
}

const SUN_PROPS: SolarObjectProps = {
  offsetX: 0,
  offsetY: 0,
  radius: 70,
  orbit: {
    semiMajorAxis: 0,
    periapsis: 0,
    apoapsis: 0,
  },
  options: {
    label: "SUN",
    mass: 33300,
    render: {
      fillStyle: "yellow",
    },
  },
  velocity: {
    x: 0,
    y: 0,
  },
} as const;
const MERCURY_PROPS = {
  offsetX: 0,
  offsetY: 380, //aphelion: 0.4667 AU, perihelion: 0.3075 AU
  radius: 4,
  orbit: {
    semiMajorAxis: 0.387098,
    periapsis: 0.307499,
    apoapsis: 0.466697,
  },
  options: {
    label: "MERCURY",

    mass: 0.5, //0.05 earth
    render: {
      fillStyle: "pink",
    },
  },
} as const;
const VENUS_PROPS: SolarObjectProps = {
  offsetX: 720, // aphelion: 0.7282 AU, perihelion: 0.7184 AU
  offsetY: 0,
  radius: 9.5,
  orbit: {
    semiMajorAxis: 0.723332,
    periapsis: 0.71844,
    apoapsis: 0.728213,
  },
  options: {
    label: "VENUS",

    mass: 8.5, //0.85 earth
    render: {
      fillStyle: "orange",
    },
  },
} as const;
const EARTH_PROPS: SolarObjectProps = {
  offsetX: 1000,
  offsetY: 0,
  radius: 1,
  orbit: {
    semiMajorAxis: 1,
    periapsis: 0.9833,
    apoapsis: 1.0167,
  },
  options: {
    mass: 10,
    label: "EARTH",
    render: {
      fillStyle: "blue",
    },
  },
} as const;
const ROCKET_PROPS: SolarObjectProps = {
  offsetX: EARTH_PROPS.offsetX,
  offsetY: EARTH_PROPS.offsetY + 10,
  radius: 2,
  orbit: {
    semiMajorAxis: 0,
    periapsis: 0,
    apoapsis: 0,
  },
  options: {
    label: "ROCKET",
    mass: 0.000001,
    render: {
      fillStyle: "black",
    },
  },
  // velocity: {
  //   x: 0,
  //   y: 0.5,
  // },
} as const;
const MOON_PROPS: SolarObjectProps = {
  offsetX: 30,
  offsetY: 0,
  radius: 1,
  orbit: {
    semiMajorAxis: 0.002569 * 5,
    apoapsis: 0.00271 * 5,
    periapsis: 0.002424 * 5,
  },
  options: {
    label: "MOON",
    mass: 0.123,
    render: {
      fillStyle: "white",
    },
  },
  // velocity: {
  //   x: 0,
  //   y: 0.71,
  // },
} as const;
const MARS_PROPS = {
  offsetX: 0,
  offsetY: -1500,
  radius: 5,
  orbit: {
    semiMajorAxis: 1.5237,
    periapsis: 1.3814,
    apoapsis: 1.666,
  },
  options: {
    label: "MARS",
    mass: 0.5,
    render: {
      fillStyle: "red",
    },
  },
};
const JUPITER_PROPS = {
  orbit: {
    semiMajorAxis: 5.2038,
    periapsis: 4.9506,
    apoapsis: 5.457,
  },
  offsetX: -4000,
  offsetY: 0,
  radius: 30,
  options: {
    label: "JUPITER",
    mass: 100,
    render: {
      fillStyle: "orange",
    },
  },
};
// SOLAR_PROPS_ARR.forEach((props) => {
//   const orbitalRadius = Math.sqrt(props.offsetX ** 2 + props.offsetY ** 2);
//   const velocity = getOrbitalVelocity(props.options.mass, orbitalRadius);
//   props.velocity = {
//     x: (velocity * props.offsetX) / orbitalRadius,
//     y: (velocity * props.offsetY) / orbitalRadius,
//   };
// });

function setSolarObjectProps_CB(
  centerX: number,
  centerY: number,
  parentMass: number = SUN_PROPS.options.mass,
  parentVelocity = { x: 0, y: 0 },
) {
  return (props: SolarObjectProps) => {
    const orbitalRadius = Math.sqrt(props.offsetX ** 2 + props.offsetY ** 2);
    const velocity = getOrbitalVelocity(
      parentMass,
      props.options.mass,
      orbitalRadius,
    );
    const dx = -(velocity * props.offsetY) / orbitalRadius;
    const dy = (velocity * props.offsetX) / orbitalRadius;
    SolarBodiesLog.debug({
      message:
        parentMass === SUN_PROPS.options.mass
          ? "getSolarObjectProps"
          : "getOrbitalObjectProps",
      id: props.options.label,
      props,
      orbitalRadius,
      velocity,
      dx,
      dy,
    });
    return {
      ...props,
      x: centerX + props.offsetX,
      y: centerY + props.offsetY,
      velocity: {
        x: dx,
        y: dy,
      },
    };
  };
}

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

const NULL_ASTRONOMICAL_BODY = {
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  mass: 0,
};
//const AU_SCALE = 149597870700;
const AU_SCALE = 1000;
function generateAstronomicalBodies(
  this: any,
  bodyProps: SolarObjectProps,
  parent?: Body,
  centerPoint?: { x: number; y: number },
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
  const orbitalAngle = getRandomArbitrary(0, 360);
  const orbitalPosition = getPointOnCircle(orbitalRadius, orbitalAngle);
  const position = { x: 0, y: 0 };
  if (parent) {
    position.x = (parent.position.x + orbitalPosition.x) * distanceScale;
    position.y = (parent.position.y + orbitalPosition.y) * distanceScale;
  } else if (centerPoint) {
    position.x = centerPoint.x;
    position.y = centerPoint.y;
  }
  const mass = bodyProps.options.mass * massScale;
  const stdGravParam = getStandardGravitationalParameter(
    parent?.mass ?? 0,
    bodyProps.options.mass,
  );

  const parentVelocity = parent?.velocity
    ? getVectorMagnitude(parent.velocity)
    : 0;
  let velocity =
    orbitalRadius > 0
      ? getEllipticalOrbitalVelocity(stdGravParam, orbitalRadius, semiMajorAxis)
      : 0;
  let dx =
    -(velocity * orbitalPosition.y) / orbitalRadius + (parent?.velocity.x ?? 0);
  dx = isNaN(dx) ? 0 : dx;
  let dy =
    (velocity * orbitalPosition.x) / orbitalRadius + (parent?.velocity.y ?? 0);
  dy = isNaN(dy) ? 0 : dy;
  const body = Bodies.circle(position.x, position.y, bodyProps.radius, {
    ...genSolarBodies,
    ...bodyProps.options,
    mass: mass,
    render: {
      sprite: {
        xScale: 2,
        yScale: 2,
      },
    },
  });
  AstronomicalBodiesLog.debug({
    message: "Orbital Data",
    orbitalRadius,
    orbitalPosition,
    velocity,
    parentVelocity: parent?.velocity,
    semiMajorAxis,
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

export const solarSystemObjects = (cw: number, ch: number) => {
  const centerX = cw / 2,
    centerY = ch / 2;
  const getSolarObjectProps = setSolarObjectProps_CB(centerX, centerY);

  const sunProps = getSolarObjectProps(SUN_PROPS);
  const centerPoint = {
    x: centerX,
    y: centerY,
  };
  const sunBody = generateAstronomicalBodies(SUN_PROPS, undefined, centerPoint);
  const sun = sunBody.body;
  const generateSolarOrbitals = sunBody.generateChildBodies;

  const genMercury = generateSolarOrbitals(MERCURY_PROPS);
  const mercury = genMercury.body;
  // const mercuryProps = getSolarObjectProps(MERCURY_PROPS);
  // const mercury = Bodies.circle(
  //   mercuryProps.x,
  //   mercuryProps.y,
  //   mercuryProps.radius,
  //   {
  //     ...genSolarBodies,
  //     ...mercuryProps.options,
  //     isStatic: false,
  //   },
  // );

  //Body.setVelocity(mercury, mercuryProps.velocity);

  const genVenus = generateSolarOrbitals(VENUS_PROPS);
  const venus = genVenus.body;
  //const venusProps = getSolarObjectProps(VENUS_PROPS);
  //const venus = Bodies.circle(venusProps.x, venusProps.y, venusProps.radius, {
  //  ...genSolarBodies,
  //  ...venusProps.options,
  //  isStatic: false,
  //  //mass: 0.85,
  //  //render: {
  //  //  fillStyle: "orange",
  //  //},
  //});
  //Body.setVelocity(venus, venusProps.velocity);

  const genEarth = generateSolarOrbitals(EARTH_PROPS);
  const earth = genEarth.body;

  const genMoon = genEarth.generateChildBodies(MOON_PROPS);
  const moon = genMoon.body;

  const rocketProps = getSolarObjectProps(ROCKET_PROPS);
  const rocket = Bodies.circle(
    rocketProps.x,
    rocketProps.y,
    rocketProps.radius,
    {
      ...genSolarBodies,
      ...rocketProps.options,
      isStatic: false,
    },
  );

  //const moonProps = getEarthSOIProps(MOON_PROPS);
  //const moon = Bodies.circle(moonProps.x, moonProps.y, moonProps.radius, {
  //  ...genSolarBodies,
  //  ...moonProps.options,
  //  isStatic: false,
  //});
  //Body.setVelocity(moon, moonProps.velocity);
  //
  const genMars = generateSolarOrbitals(MARS_PROPS);
  const mars = genMars.body;

  //const marsProps = getSolarObjectProps(MARS_PROPS);
  //const mars = Bodies.circle(marsProps.x, marsProps.y, marsProps.radius, {
  //  ...genSolarBodies,
  //  ...marsProps.options,
  //  isStatic: false,
  //});
  //Body.setVelocity(mars, marsProps.velocity);

  const genJupiter = generateSolarOrbitals(JUPITER_PROPS);
  const jupiter = genJupiter.body;
  // const jupiterProps = getSolarObjectProps(JUPITER_PROPS);
  // const jupiter = Bodies.circle(
  //   jupiterProps.x,
  //   jupiterProps.y,
  //   jupiterProps.radius,
  //   {
  //     ...genSolarBodies,
  //     ...jupiterProps.options,
  //     isStatic: false,
  //   },
  // );
  // Body.setVelocity(jupiter, jupiterProps.velocity);

  const asteroids: Body[] = [];
  const generateAsteroid = (index: number, angle?: number) => {
    const orbitalRadius =
      Math.max(gaussianRandom(1350, 400), 200) * distanceScale;
    console.log("Orbital Radius: ", orbitalRadius);
    //const orbitalRadius = 1100 + Math.random() * 500;
    const radius = 1 + Math.random() * 2;
    angle = angle ?? Math.random() * 360;
    const mass = 0.0005 * radius ** 2 * massScale;
    const position = getPointOnCircle(orbitalRadius, angle);
    const positionX = centerX + position.x;
    const positionY = centerY + position.y;
    const body = Bodies.circle(positionX, positionY, radius, {
      ...genSolarBodies,
      isStatic: false,
      mass: mass,
      label: "asteroid " + index,
      render: {
        fillStyle: "gray",
      },
    });
    const velocity =
      getOrbitalVelocity(sunProps.options.mass, mass, orbitalRadius) *
      Math.max(gaussianRandom(1, 0.5), 0.6);
    //getRandomArbitrary(1, 1.2);
    const xVelocity = (velocity * position.y) / orbitalRadius;
    const yVelocity = (velocity * position.x) / orbitalRadius;
    SolarBodiesLog.debug({
      message: "Asteroid Stats: ",
      angle,
      positionX,
      positionY,
      velocity,
      xVelocity,
      yVelocity,
    });
    Body.setVelocity(body, {
      x: -xVelocity,
      y: yVelocity,
    });
    SolarBodiesLog.debug({ message: "Asteroid Object", body });
    asteroids.push(body);
  };

  //generateAsteroid();
  for (let i = 0; i < 150; i++) {
    generateAsteroid(i);
  }

  //const earthMoonConstraint = Constraint.create({
  //  bodyA: earth,
  //  bodyB: moon,
  //  stiffness: 0,
  //});

  return {
    sun,
    mercury,
    venus,
    earth,
    rocket,
    moon,
    mars,
    asteroids,
    jupiter,
  };
};
