import MatterAttractors from "matter-attractors";
import { Bodies, Body } from "matter-js";
import { getPointOnCircle } from "../geometry/lib";
import {
  getCircularOrbitalVelocity,
  getEllipticalOrbitalVelocity,
  getRandomArbitrary,
  getStandardGravitationalParameter,
} from "./lib";
import { Coordinates, GenericKeyValueObject } from "../interfaces";
import logger from "../pino";
import { collisionFilters } from "./constants";

const SYSTEM_SCALE = 1 as const;
const AU_SCALE = 1000 as const;

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

const ROOT_ASTRONOMICAL_BODY = {
  apoapsis: 0,
  periapsis: 0,
  semiMajorAxis: 0,
  radius: 0,
  velocity: { x: 0, y: 0 },
};

interface OrbitDetails {
  [key: string]: number | Coordinates;
  semiMajorAxis: number;
  stdGravParam: number;
  apoapsis: number;
  periapsis: number;
  radius: number;
  angle: number;
  position: Coordinates;
  velocity: Coordinates;
}
type PartialOrbitDetails = Partial<OrbitDetails>;
interface NullOrbitProps {
  position: Coordinates;
}
interface CircularOrbitProps {
  radius: number;
  velocity?: Coordinates;
  angle?: number;
}
interface EllipticalOrbitProps {
  semiMajorAxis: number;
  apoapsis: number;
  periapsis: number;
  radius?: number;
  angle?: number;
}
type IOrbitProps = NullOrbitProps | CircularOrbitProps | EllipticalOrbitProps;

interface IAstronomicalBody {
  label: string;
  mass: number;
  stdGravParam: (() => number) | number;
  initialOrbit: OrbitDetails;
  getSemiMajorAxis: () => number;
  getApoapsis: () => number;
  getPeriapsis: () => number;
  getOrbitalPeriod: () => number;
  getVelocity: () => Coordinates;
  getOrbitalRadius: () => number;
  getBody: () => Body;
  getParentBody: () => Body | undefined;
  generateChild: (props: RequiredAstronomicalBodyProps) => AstronomicalBody;
  parent?: AstronomicalBody | Coordinates;
  children?: AstronomicalBody[];
}

interface RequiredAstronomicalBodyProps {
  label: string;
  mass: number;
  radius: number;
  fillStyle: string;
  orbit: IOrbitProps;
}

class AstronomicalBody implements IAstronomicalBody {
  private static DISTANCE_SCALE = SYSTEM_SCALE;
  private static MASS_SCALE = Math.sqrt(SYSTEM_SCALE);
  static system: Body[] = [];

  label: string;
  mass: number;
  radius: number;
  stdGravParam: (() => number) | number;
  initialOrbit: OrbitDetails;
  fillStyle: string;
  body?: Body;
  centerBody?: AstronomicalBody;
  children: AstronomicalBody[];
  log: any;

  constructor(
    props: RequiredAstronomicalBodyProps,
    centerBody?: AstronomicalBody,
  ) {
    this.mass = props.mass * AstronomicalBody.MASS_SCALE;
    this.label = props.label;
    this.radius = props.radius;
    this.fillStyle = props.fillStyle;
    this.centerBody = centerBody;
    this.stdGravParam = getStandardGravitationalParameter(
      centerBody?.mass ?? 0,
      this.mass,
    );
    this.initialOrbit = this.generateInitialOrbitData(
      props.orbit as PartialOrbitDetails,
    );
    this.children = [];
    this.log = logger.child({ module: "Astronomical Body", label: this.label });
  }

  getSystem(useCached = true) {
    if (useCached && AstronomicalBody.system.length > 0)
      return AstronomicalBody.system;
    const system = [this.getBody()];
    for (let i = 0; i < this.children.length; i++) {
      system.push(...this.children[i].getSystem(false));
    }
    AstronomicalBody.system = system;
    return system;
  }
  getSemiMajorAxis() {
    return this.initialOrbit.semiMajorAxis;
  }
  getApoapsis() {
    return this.initialOrbit.apoapsis;
  }
  getPeriapsis() {
    return this.initialOrbit.periapsis;
  }
  getOrbitalPeriod() {
    return 0;
  }
  getVelocity() {
    return this.initialOrbit.velocity;
  }
  getOrbitalRadius() {
    return this.initialOrbit.radius;
  }
  getParentBody() {
    return this.centerBody?.body;
  }
  getBody() {
    if (!this.body) {
      this.body = Bodies.circle(
        this.initialOrbit.position.x,
        this.initialOrbit.position.y,
        this.radius,
        {
          ...genSolarBodies,
          label: this.label,
          mass: this.mass,
          render: {
            fillStyle: this.fillStyle,
          },
        },
      );
      Body.setVelocity(this.body, this.initialOrbit.velocity);
    }
    return this.body;
  }
  generateChild(props: RequiredAstronomicalBodyProps) {
    const child = new AstronomicalBody(props, this);
    this.children.push(child);
    return child;
  }
  private generateInitialOrbitData(args: PartialOrbitDetails): OrbitDetails {
    for (const key in args) {
      const value = args[key];
      if (typeof value === "number")
        args[key] = value * AstronomicalBody.DISTANCE_SCALE * AU_SCALE;
      else if (value?.x && value?.y)
        args[key] = {
          x: value.x * AstronomicalBody.DISTANCE_SCALE * AU_SCALE,
          y: value.y * AstronomicalBody.DISTANCE_SCALE * AU_SCALE,
        };
    }
    this.log.debug({
      message: "Scaled Initial Orbit Data: ",
      args,
    });
    args.stdGravParam = getStandardGravitationalParameter(
      this.centerBody?.mass ?? 0,
      this.mass,
    );
    if (args.position) {
      return {
        ...ROOT_ASTRONOMICAL_BODY,
        ...args,
      } as OrbitDetails;
    }

    let velocity;
    args.angle = args.angle ?? getRandomArbitrary(0, 360);
    if (args.semiMajorAxis && args.periapsis && args.apoapsis) {
      args.radius =
        args.radius ?? getRandomArbitrary(args.periapsis, args.apoapsis);
      args.position = getPointOnCircle(args.radius, args.angle);
      if (!args.velocity) {
        velocity = getEllipticalOrbitalVelocity(
          args.stdGravParam!,
          args.radius,
          args.semiMajorAxis,
        );
      }
    } else if (args.radius) {
      args.periapsis = args.radius;
      args.apoapsis = args.radius;
      args.semiMajorAxis = args.radius;
      args.position = getPointOnCircle(args.radius, args.angle);
      if (!args.velocity) {
        velocity = getCircularOrbitalVelocity(args.stdGravParam!, args.radius);
      }
    } else {
      throw new Error(
        "Invalid orbit data, failed to generate initial orbit data for " +
          this.label,
        { cause: args },
      );
    }
    if (!args.velocity && velocity) {
      args.velocity = {
        x:
          -(velocity * args.position.y) / args.radius! +
          (this.centerBody?.body?.velocity.x ?? 0),
        y:
          -(velocity * args.position.x) / args.radius! +
          (this.centerBody?.body?.velocity.y ?? 0),
      };
    } else
      throw new Error("Failed calculating velocity for " + this.label, {
        cause: args,
      });
    this.log.debug({
      message: "Calculated Initial Orbit Data: ",
      args,
    });
    return args as unknown as OrbitDetails;
  }
}
