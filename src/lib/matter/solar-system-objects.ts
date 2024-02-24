import { Bodies, Body, Constraint } from "matter-js";
import { collisionFilters } from "./constants";
import MatterAttractors from "matter-attractors";
import {
  gaussianRandom,
  getOrbitalVelocity,
  getPointOnCircle,
  getRandomArbitrary,
} from "../lib";
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
const orbitScale = SYSTEM_SCALE;
const massScale = 1 / Math.sqrt(SYSTEM_SCALE);

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
  options: {
    label: "SUN",
    mass: 16650 * massScale,
    render: {
      fillStyle: "yellow",
    },
  },
  velocity: {
    x: 0,
    y: 0,
  },
} as const;
const MERCURY_PROPS: SolarObjectProps = {
  offsetX: 0,
  offsetY: 380 * orbitScale, //aphelion: 0.4667 AU, perihelion: 0.3075 AU
  radius: 4,
  options: {
    label: "MERCURY",

    mass: 0.25 * massScale, //0.05 earth
    render: {
      fillStyle: "pink",
    },
  },
  // velocity: {
  //   x: -0.67,
  //   y: 0,
  // },
} as const;
const VENUS_PROPS: SolarObjectProps = {
  offsetX: 720 * orbitScale, // aphelion: 0.7282 AU, perihelion: 0.7184 AU
  offsetY: 0,
  radius: 9.5,
  options: {
    label: "VENUS",

    mass: 4.2, //0.85 earth
    render: {
      fillStyle: "orange",
    },
  },
  //velocity: {
  //  x: 0,
  //  y: -0.6,
  //},
} as const;
const EARTH_PROPS: SolarObjectProps = {
  offsetX: 1000 * orbitScale,
  offsetY: 0,
  radius: 10,
  options: {
    mass: 5 * massScale,
    label: "EARTH",
    render: {
      fillStyle: "blue",
    },
  },
  // velocity: {
  //   x: 0,
  //   y: 0.5,
  // },
} as const;
const ROCKET_PROPS: SolarObjectProps = {
  offsetX: EARTH_PROPS.offsetX,
  offsetY: EARTH_PROPS.offsetY + 10,
  radius: 2,
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
  offsetX: 30 * orbitScale,
  offsetY: 0,
  radius: 3,
  options: {
    label: "MOON",
    mass: 0.01 * massScale,
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
  offsetY: -1500 * orbitScale,
  radius: 5,
  options: {
    label: "MARS",
    mass: 0.5 * massScale,
    render: {
      fillStyle: "red",
    },
  },
};
const JUPITER_PROPS = {
  offsetX: -4000 * orbitScale,
  offsetY: 0,
  radius: 30,
  options: {
    label: "JUPITER",
    mass: 100 * orbitScale,
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
    const dx = -(velocity * props.offsetY) / orbitalRadius + parentVelocity.x;
    const dy = (velocity * props.offsetX) / orbitalRadius + parentVelocity.y;
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

// const MoonProperties = {
//   x: centerX + MOON_PROPS.offsetX,
//   y: centerY + MOON_PROPS.offsetY,
// }

export const solarSystemObjects = (cw: number, ch: number) => {
  const genSolarBodies = {
    isStatic: false,
    friction: 0,
    frictionAir: 0,
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
  };

  const centerX = cw / 2,
    centerY = ch / 2;
  const getSolarObjectProps = setSolarObjectProps_CB(centerX, centerY);

  const sunProps = getSolarObjectProps(SUN_PROPS);
  const sun = Bodies.circle(sunProps.x, sunProps.y, sunProps.radius, {
    ...genSolarBodies,
    ...sunProps.options,
    isStatic: true,
  });

  const mercuryProps = getSolarObjectProps(MERCURY_PROPS);
  const mercury = Bodies.circle(
    mercuryProps.x,
    mercuryProps.y,
    mercuryProps.radius,
    {
      ...genSolarBodies,
      ...mercuryProps.options,
      isStatic: false,
    },
  );

  Body.setVelocity(mercury, mercuryProps.velocity);

  const venusProps = getSolarObjectProps(VENUS_PROPS);
  const venus = Bodies.circle(venusProps.x, venusProps.y, venusProps.radius, {
    ...genSolarBodies,
    ...venusProps.options,
    isStatic: false,
    //mass: 0.85,
    //render: {
    //  fillStyle: "orange",
    //},
  });
  Body.setVelocity(venus, venusProps.velocity);

  const earthProps = getSolarObjectProps(EARTH_PROPS);
  const earth = Bodies.circle(earthProps.x, earthProps.y, earthProps.radius, {
    ...genSolarBodies,
    ...earthProps.options,
    isStatic: false,
  });
  Body.setVelocity(earth, earthProps.velocity);

  const getEarthSOIProps = setSolarObjectProps_CB(
    earthProps.x,
    earthProps.y,
    earthProps.options.mass,
    earthProps.velocity,
    //{ x: 0, y: 0 },
  );
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
  const earthSOI = Bodies.circle(centerX + 400, centerY, 50, {
    ...genSolarBodies,
    mass: 0,
    render: {
      fillStyle: "transparent",
      strokeStyle: "red",
    },
  });

  const moonProps = getEarthSOIProps(MOON_PROPS);
  const moon = Bodies.circle(moonProps.x, moonProps.y, moonProps.radius, {
    ...genSolarBodies,
    ...moonProps.options,
    isStatic: false,
  });
  Body.setVelocity(moon, moonProps.velocity);

  const marsProps = getSolarObjectProps(MARS_PROPS);
  const mars = Bodies.circle(marsProps.x, marsProps.y, marsProps.radius, {
    ...genSolarBodies,
    ...marsProps.options,
    isStatic: false,
  });
  Body.setVelocity(mars, marsProps.velocity);

  const jupiterProps = getSolarObjectProps(JUPITER_PROPS);
  const jupiter = Bodies.circle(
    jupiterProps.x,
    jupiterProps.y,
    jupiterProps.radius,
    {
      ...genSolarBodies,
      ...jupiterProps.options,
      isStatic: false,
    },
  );
  Body.setVelocity(jupiter, jupiterProps.velocity);

  const asteroids: Body[] = [];
  const generateAsteroid = (index: number, angle?: number) => {
    const orbitalRadius = Math.max(gaussianRandom(1350, 400), 200) * orbitScale;
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
