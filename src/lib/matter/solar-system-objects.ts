import { Bodies, Body, Constraint } from "matter-js";
import { collisionFilters } from "./constants";
import MatterAttractors from "matter-attractors";
import {
  getOrbitalVelocity,
  getPointOnCircle,
  getRandomArbitrary,
} from "../lib";

export type BodyRef = Matter.Body | null;
export const SolarBodiesKeys = [
  "sun",
  "mercury",
  "venus",
  "earth",
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
    mass: number;
    render: {
      fillStyle: string;
    };
  };
  velocity: {
    x: number;
    y: number;
  };
}

const SUN_PROPS: SolarObjectProps = {
  offsetX: 0,
  offsetY: 0,
  radius: 50,
  options: {
    mass: 333,
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
  offsetY: 150,
  radius: 4,
  options: {
    mass: 0.05,
    render: {
      fillStyle: "gray",
    },
  },
  velocity: {
    x: -0.7,
    y: 0,
  },
} as const;
const VENUS_PROPS: SolarObjectProps = {
  offsetX: -200,
  offsetY: 0,
  radius: 9.5,
  options: {
    mass: 0.85,
    render: {
      fillStyle: "orange",
    },
  },
  velocity: {
    x: 0,
    y: -0.7,
  },
} as const;
const EARTH_PROPS: SolarObjectProps = {
  offsetX: 400,
  offsetY: 0,
  radius: 10,
  options: {
    mass: 6,
    render: {
      fillStyle: "blue",
    },
  },
  velocity: {
    x: 0,
    y: 0.5,
  },
} as const;
const MOON_PROPS: SolarObjectProps = {
  offsetX: EARTH_PROPS.offsetX + 40,
  offsetY: 0,
  radius: 3,
  options: {
    mass: 0.02,
    render: {
      fillStyle: "white",
    },
  },
  velocity: {
    x: 0,
    y: 0.705,
  },
} as const;

function setSolarObjectProps_CB(centerX: number, centerY: number) {
  return (props: SolarObjectProps) => {
    return {
      ...props,
      x: centerX + props.offsetX,
      y: centerY + props.offsetY,
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

  const solarMass = 333;
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
  const earthSOI = Bodies.circle(centerX + 400, centerY, 50, {
    ...genSolarBodies,
    mass: 0,
    render: {
      fillStyle: "transparent",
      strokeStyle: "red",
    },
  });

  const moonProps = getSolarObjectProps(MOON_PROPS);
  const moon = Bodies.circle(moonProps.x, moonProps.y, moonProps.radius, {
    //centerX + 725, centerY, 3, {
    ...genSolarBodies,
    ...moonProps.options,
    isStatic: false,
  });
  Body.setVelocity(moon, moonProps.velocity);

  const asteroids: Body[] = [];
  const generateAsteroid = (index: number, angle?: number) => {
    const orbitalRadius = 800 + Math.random() * 150;
    const radius = 1 + Math.random() * 3;
    angle = angle ?? Math.random() * 360;
    const mass = 0.05;
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
      getOrbitalVelocity(sunProps.options.mass, orbitalRadius) *
      getRandomArbitrary(1, 1.2);
    const xVelocity = (velocity * position.y) / orbitalRadius;
    const yVelocity = (velocity * position.x) / orbitalRadius;
    console.log("Asteroid Stats: ", {
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
    console.log("Asteroid Object", body);
    asteroids.push(body);
  };

  //generateAsteroid();
  for (let i = 0; i < 150; i++) {
    generateAsteroid(i);
  }
  console.log("Asteroids: ", asteroids);

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
    moon,
    asteroids,
  };
};
