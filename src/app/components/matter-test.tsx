"use client";
import { useEffect, useRef, memo } from "react";
import Matter from "matter-js";
import {
  Engine,
  Render,
  Body,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
  Constraint,
  Runner,
  Events,
  Common,
} from "matter-js";
import MatterAttractors from "matter-attractors";
//import MatterWrap from "matter-wrap";
import logger from "@/lib/pino";
import { useTheme } from "next-themes";
import { useWindowSize } from "@/lib/hooks/resize";
import {
  getOrbitalVelocity,
  getPointOnCircle,
  getRandomArbitrary,
  objectToFlatArray,
} from "@/lib/lib";
import { collisionFilters } from "@/lib/matter/constants";
import {
  SolarBodies,
  solarSystemObjects,
} from "@/lib/matter/solar-system-objects";

Matter.use(MatterAttractors);

const MatterLogger = logger.child({ module: "Matter Canvas" });

export default function MatterTest() {
  const theme = useTheme().theme;
  const windowSize = useWindowSize();
  const scene = useRef<HTMLDivElement>(null);
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());
  const balls = useRef<Matter.Body[]>([]);
  const contentRef = useRef<HTMLElement | null>(null);
  //const boundingBoxes = useRef<Matter.Body[]>([]);
  const contentBody = useRef<Matter.Body | null>(null);
  const render = useRef<Matter.Render>();
  const colors = useRef<number[]>([]);
  const solarBodies = useRef<SolarBodies>({
    sun: null,
    mercury: null,
    venus: null,
    earth: null,
    moon: null,
    asteroids: [],
  });

  engine.current.timing.timeScale = 0.5;
  engine.current.world.gravity.scale = 0;

  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;

    if (scene.current === null) {
      MatterLogger.error({
        message: "Scene is null",
        scene: scene.current,
      });
      return;
    }
    render.current = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
        //showBounds: true,
        showDebug: true,
      },
    });
    console.log("Render context", render.current.context);

    // const genSolarBodies = {
    //   isStatic: false,
    //   friction: 0,
    //   frictionAir: 0,
    //   collisionFilter: {
    //     category: collisionFilters.balls,
    //     mask:
    //       collisionFilters.balls |
    //       collisionFilters.mouse |
    //       collisionFilters.content,
    //   },
    //   plugin: {
    //     attractors: [MatterAttractors.Attractors.gravity],
    //   },
    // };
    //
    // const solarMass = 333;
    // const centerX = cw / 2,
    //   centerY = ch / 2;
    // solarObjs.sun = Bodies.circle(centerX, centerY, 50, {
    //   ...genSolarBodies,
    //   isStatic: true,
    //   mass: solarMass,
    //   render: {
    //     fillStyle: "yellow",
    //   },
    // });
    //
    // solarObjs.mercury = Bodies.circle(centerX, centerY + 150, 4, {
    //   ...genSolarBodies,
    //   isStatic: false,
    //   mass: 0.05,
    //   render: {
    //     fillStyle: "gray",
    //   },
    // });
    //
    // Body.setVelocity(solarObjs.mercury, {
    //   x: -0.7,
    //   y: 0,
    // });
    //
    // solarObjs.venus = Bodies.circle(centerX - 200, centerY, 9.5, {
    //   ...genSolarBodies,
    //   isStatic: false,
    //   mass: 0.85,
    //   render: {
    //     fillStyle: "orange",
    //   },
    // });
    // Body.setVelocity(solarObjs.venus, {
    //   x: 0,
    //   y: -0.7, //2.7
    // });
    //
    // solarObjs.earth = Bodies.circle(centerX + 700, centerY, 10, {
    //   ...genSolarBodies,
    //   isStatic: false,
    //   mass: 6,
    //   render: {
    //     fillStyle: "blue",
    //   },
    // });
    // Body.setVelocity(solarObjs.earth, {
    //   x: 0,
    //   y: 0.5,
    // });
    // solarObjs.earthSOI = Bodies.circle(centerX + 400, centerY, 50, {
    //   ...genSolarBodies,
    //   mass: 0,
    //   render: {
    //     fillStyle: "transparent",
    //     strokeStyle: "red",
    //   },
    // });
    //
    // solarObjs.moon = Bodies.circle(centerX + 725, centerY, 3, {
    //   ...genSolarBodies,
    //   isStatic: false,
    //   mass: 0.02,
    //   render: {
    //     fillStyle: "white",
    //   },
    // });
    // Body.setVelocity(solarObjs.moon, {
    //   x: 0,
    //   y: 0.75,
    // });
    //
    // const generateAsteroid = (index: number, angle?: number) => {
    //   const orbitalRadius = 500 + Math.random() * 150;
    //   //const orbitalRadius = 500;
    //   //const radius = 1 + Math.random() * 3;
    //   const radius = 5;
    //   angle = angle ?? Math.random() * 360;
    //   //const angle = 270;
    //   const mass = 0.05;
    //   const position = getPointOnCircle(orbitalRadius, angle);
    //   const positionX = centerX + position.x;
    //   const positionY = centerY + position.y;
    //   const body = Bodies.circle(positionX, positionY, radius, {
    //     ...genSolarBodies,
    //     isStatic: false,
    //     mass: mass,
    //     label: "asteroid " + index,
    //     render: {
    //       fillStyle: "gray",
    //     },
    //   });
    //   const velocity =
    //     getOrbitalVelocity(solarMass, orbitalRadius) *
    //     getRandomArbitrary(1, 1.2);
    //   const xVelocity = (velocity * position.y) / orbitalRadius;
    //   const yVelocity = (velocity * position.x) / orbitalRadius;
    //   console.log("Asteroid Stats: ", {
    //     angle,
    //     positionX,
    //     positionY,
    //     velocity,
    //     xVelocity,
    //     yVelocity,
    //   });
    //   Body.setVelocity(body, {
    //     x: -xVelocity,
    //     y: yVelocity,
    //   });
    //   console.log("Asteroid Object", body);
    //   solarObjs.asteroids.push(body);
    //   Composite.add(engine.current.world, body);
    // };
    //
    // //generateAsteroid();
    // for (let i = 0; i < 150; i++) {
    //   generateAsteroid(i);
    // }
    //
    // const earthMoonConstraint = Constraint.create({
    //   bodyA: solarObjs.earth,
    //   bodyB: solarObjs.moon,
    //   stiffness: 0,
    // });
    const solarObjs = solarSystemObjects(cw, ch);
    solarBodies.current = solarSystemObjects(cw, ch);

    Composite.add(engine.current.world, [
      solarObjs.sun,
      solarObjs.mercury,
      solarObjs.venus,
      solarObjs.earth,
      solarObjs.moon,
      ...solarObjs.asteroids,
      //earthMoonConstraint,
    ]);

    console.log("Window", window.innerWidth, window.innerHeight);
    const mouse = Mouse.create(render.current.canvas),
      mouseConstraint = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.98,
          render: {
            visible: false,
          },
        },
        collisionFilter: {
          category: collisionFilters.mouse,
        },
      });
    Composite.add(engine.current.world, mouseConstraint);

    const test = [
      solarObjs.sun,
      solarObjs.mercury,
      solarObjs.venus,
      solarObjs.earth,
      solarObjs.moon,
      ...solarObjs.asteroids,
    ];
    //const test = objectToFlatArray<Matter.Body>(solarObjs);
    console.log("Flattened solar objects", test);
    Matter.Events.on(mouseConstraint, "mousemove", function (event) {
      //For Matter.Query.point pass "array of bodies" and "mouse position"
      var foundPhysics = Matter.Query.point(test, event.mouse.position);

      //Your custom code here
      console.log("on hover event", foundPhysics[0]); //returns a shape corrisponding to the mouse position
    });

    render.current.mouse = Mouse.create(render.current.canvas);
    Runner.run(engine.current);
    Render.run(render.current);
    console.log(
      "All rendered bodies",
      Composite.allBodies(engine.current.world),
    );

    return () => {
      console.log("Cleaning up Matter");
      if (!render.current) {
        MatterLogger.error({
          message: "Render is null on cleanup",
          render: render.current,
        });
        return;
      }
      render.current.canvas.remove();
      render.current.textures = {};
      //render.current.element = null;
      console.log(
        "All rendered bodies on cleanup",
        Composite.allBodies(engine.current.world),
      );
      Composite.clear(engine.current.world, false, false);

      Engine.clear(engine.current);

      solarObjs.asteroids = [];
    };
  }, []);

  //Handle window mounting and resizing
  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;
    MatterLogger.info({
      message: "Resizing canvas",
      windowSize: windowSize,
      cw: cw,
      ch: ch,
    });
    if (contentRef.current === null) {
      contentRef.current = document.getElementById("collidable-wrapper");
      if (contentRef.current === null) {
        MatterLogger.error({
          message: "Content ref is null during resize event",
          contentRef: contentRef.current,
        });
        return;
      }
    }
    if (!render.current) {
      MatterLogger.error({
        message: "Render is null during resize event",
        render: render.current,
      });
      return;
    }
    if (contentBody.current) {
      MatterLogger.info({
        message: "Removing content body during resize event",
        bodies: Composite.allBodies(engine.current.world),
      });
    }
    const contentX =
      contentRef.current.offsetLeft + contentRef.current.clientWidth / 2;
    const contentY =
      contentRef.current.getBoundingClientRect().top +
      contentRef.current.clientHeight / 2;

    // contentBody.current = Bodies.rectangle(
    //   contentX,
    //   contentY,
    //   contentRef.current.getBoundingClientRect().width,
    //   contentRef.current.clientHeight,
    //   {
    //     isStatic: true,
    //     mass: 100,
    //     collisionFilter: { category: collisionFilters.content },
    //     plugin: {
    //       attractors: [MatterAttractors.Attractors.gravity],
    //     },
    //     render: {
    //       lineWidth: 2,
    //       strokeStyle: "red",
    //       fillStyle: "transparent",
    //     },
    //   },
    // );
    render.current.bounds.max.x = cw;
    render.current.bounds.max.y = ch;
    render.current.canvas.width = cw;
    render.current.canvas.height = ch;
    render.current.options.width = cw;
    render.current.options.height = ch;
    render.current.mouse = Mouse.create(render.current.canvas);

    Render.world(render.current);
    //Composite.add(engine.current.world, [contentBody.current]);
  }, [windowSize]);

  // Handle theme changes
  useEffect(() => {
    MatterLogger.info({
      message: "Updating ball colors",
      colors: colors.current,
      theme: theme,
    });
    // balls.current.forEach((ball, index) => {
    //   ball.render.fillStyle =
    //     theme === "dark"
    //       ? darkColors[colors.current[index]]
    //       : lightColors[colors.current[index]];
    // });
  }, [theme]);

  const group = Body.nextGroup(true);

  const handleHover = (e: any) => {
    console.log("");
  };
  const handleDown = () => {
    isPressed.current = true;
  };
  const handleUp = () => {
    isPressed.current = false;
  };

  const handleClick = (e: any) => {};

  return (
    <div
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseMove={handleClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div ref={scene} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
}
