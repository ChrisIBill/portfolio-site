"use client";
import { useEffect, useRef, memo, useState } from "react";
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
  ClampToRange,
  getOrbitalVelocity,
  getPointOnCircle,
  getRadiusFromPoints,
  getRandomArbitrary,
  objectToFlatArray,
} from "@/lib/lib";
import {
  GRAVITATIONAL_CONSTANT,
  collisionFilters,
} from "@/lib/matter/constants";
import {
  SolarBodies,
  solarSystemObjects,
} from "@/lib/matter/solar-system-objects";
import {
  Coordinates,
  directionToCoordsMap,
  directionType,
} from "@/lib/interfaces";
import pino from "pino";

Matter.use(MatterAttractors);
MatterAttractors.Attractors.gravityConstant = GRAVITATIONAL_CONSTANT;

export const MatterLogger = logger.child({ module: "Matter Canvas" });
const MovementLog = MatterLogger.child(
  { component: "Movement Handler" },
  {
    level: "info",
  },
);
const ROCKET_FORCE = 0.0000000001;

export default function MatterTest() {
  const theme = useTheme().theme;
  const windowSize = useWindowSize();
  const scene = useRef<HTMLDivElement>(null);
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());
  const contentRef = useRef<HTMLElement | null>(null);
  //const boundingBoxes = useRef<Matter.Body[]>([]);
  const contentBody = useRef<Matter.Body | null>(null);
  const render = useRef<Matter.Render>();
  const colors = useRef<number[]>([]);
  const eventCallbacks = useRef<(() => void)[]>([]);
  const solarBodies = useRef<SolarBodies>({
    sun: null,
    mercury: null,
    venus: null,
    earth: null,
    rocket: null,
    moon: null,
    asteroids: [],
  });

  engine.current.timing.timeScale = 0.01;
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

    const solarObjs = solarSystemObjects(cw, ch);
    solarBodies.current = solarObjs;

    const solarObjsArr = [
      solarObjs.sun,
      solarObjs.mercury,
      solarObjs.venus,
      solarObjs.earth,
      solarObjs.rocket,
      solarObjs.moon,
      ...solarObjs.asteroids,
    ];
    const flatSolarObjs = objectToFlatArray<Body>(solarObjs);

    Composite.add(engine.current.world, [
      solarObjs.sun,
      solarObjs.mercury,
      solarObjs.venus,
      solarObjs.earth,
      solarObjs.rocket,
      solarObjs.moon,
      ...solarObjs.asteroids,
      solarObjs.mars,
      solarObjs.jupiter,
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

    const centerX = cw / 2,
      centerY = ch / 2;
    //const solarObjsArr = objectToFlatArray<Matter.Body>(solarObjs);
    const hoverLogging = (event: any) => {
      var foundPhysics = Matter.Query.point(solarObjsArr, event.mouse.position);
      if (foundPhysics.length === 0) return;
      const x = foundPhysics[0].position.x,
        y = foundPhysics[0].position.y;

      const orbitalRadius = getRadiusFromPoints(x, y, centerX, centerY);

      console.log(
        "on hover event",
        { orbitalRadius, x: Math.abs(x - centerX), y: Math.abs(y - centerY) },
        foundPhysics[0].label,
      ); //returns a shape corrisponding to the mouse position
    };
    console.log("Flattened solar objects", solarObjsArr);
    Matter.Events.on(mouseConstraint, "mousemove", hoverLogging); //returns a shape corrisponding to the mouse position

    render.current.mouse = Mouse.create(render.current.canvas);
    Runner.run(engine.current);
    Render.run(render.current);
    console.log(
      "All rendered bodies",
      Composite.allBodies(engine.current.world),
    );

    const beforeRenderCallback = () => {
      const scaleFactor = mouse.wheelDelta * -0.1;
    };

    const moveKeySwitch = (e: any, fn: (direction: directionType) => void) => {
      e.key === "ArrowUp" && fn("up");
      e.key === "ArrowDown" && fn("down");
      e.key === "ArrowLeft" && fn("left");
      e.key === "ArrowRight" && fn("right");
    };

    const controlMovement = () => {
      let prev: undefined | (() => void);
      let vector: Coordinates = {
        x: 0,
        y: 0,
      };
      function forceApplied() {
        if (!solarBodies.current.rocket) {
          MovementLog.error({
            message: "Rocket is null",
            rocket: solarBodies.current.rocket,
          });
          return;
        }
        Body.applyForce(
          solarBodies.current.rocket,
          solarBodies.current.rocket.position,
          Matter.Vector.create(
            vector.x * ROCKET_FORCE,
            vector.y * ROCKET_FORCE,
          ),
        );
      }

      function clear() {
        MovementLog.debug({ message: "Force Cleared" });
        prev = undefined;
        vector.x = 0;
        vector.y = 0;
        Events.off(engine.current, "beforeUpdate", forceApplied);
      }
      function callback(vec: Coordinates) {
        MovementLog.debug({
          message: "Control Movement Callback",
          vec,
          prev,
          vector,
        });

        if (prev && (vector.x !== vec.x || vector.y !== vec.y)) {
          MovementLog.debug({
            message: "Clearing previous event",
            rocket: solarBodies.current.rocket,
          });
          Events.off(engine.current, "beforeRender", prev);
        } else if (vector.x === vec.x && vector.y === vec.y) {
          MovementLog.debug({ message: "Vector unchanged, returning", vector });
          return;
        }
        vector = {
          x: ClampToRange(-1, 1, vector.x + vec.x),
          y: ClampToRange(-1, 1, vector.y + vec.y),
        };
        if (!vector.x && !vector.y) {
          MovementLog.debug({
            message: "Vector is 0, halting acceleration",
            vector,
          });
          Events.off(engine.current, "beforeUpdate", forceApplied);
          prev = undefined;
        } else {
          prev = forceApplied;
          MovementLog.debug({ message: "Vector changed", vector });
          Events.on(engine.current, "beforeUpdate", forceApplied);
        }
      }
      return {
        callback,
        clear,
      };
    };
    const movementHandler = controlMovement();
    const handleArrowKeysDown = (e: any) => {
      function move(direction: directionType) {
        console.log("Moving", direction);
        const vector = directionToCoordsMap[direction];
        movementHandler.callback(vector);
      }
      moveKeySwitch(e, move);
    };
    const handleArrowKeysUp = (e: any) => {
      function endMove(direction: directionType) {
        const vector = directionToCoordsMap[direction];
        movementHandler.callback({
          x: vector.x * -1,
          y: vector.y * -1,
        });
      }
      moveKeySwitch(e, endMove);
    };

    window.addEventListener("keydown", handleArrowKeysDown);
    window.addEventListener("keyup", handleArrowKeysUp);

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
      movementHandler.clear();
      //render.current.element = null;
      console.log(
        "All rendered bodies on cleanup",
        Composite.allBodies(engine.current.world),
      );
      Composite.clear(engine.current.world, false, false);

      Engine.clear(engine.current);

      solarObjs.asteroids = [];
      window.removeEventListener("keydown", handleArrowKeysDown);
      window.removeEventListener("keyup", handleArrowKeysUp);
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
