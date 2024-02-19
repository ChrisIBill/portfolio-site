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
import MatterWrap from "matter-wrap";
import cloth from "@/lib/cloth";
import useRandomInterval from "@/lib/hooks/use-random-interval";
import logger from "@/lib/pino";
import { useTheme } from "next-themes";
import { useWindowSize } from "@/lib/hooks/resize";
import { shiftValueToRange } from "@/lib/lib";

Matter.use(MatterAttractors, MatterWrap);

const darkColors = ["#A0D7E3", "#FFD470", "#EC838C"] as const;
const lightColors = ["#074453", "#C48900", "#6A1017"] as const;

const NUM_CLOTH_COLS = 20 as const;
const NUM_BODIES = 50 as const;
const collisionFilters = {
  walls: 0x0001,
  floor: 0x0002,
  balls: 0x0004,
  mouse: 0x0008,
  content: 0x0016,
} as const;

const MatterLogger = logger.child({ module: "Matter Canvas" });

export type BodyRef = Matter.Body | null;
interface SolarBodies {
  sun: BodyRef;
  mercury: BodyRef;
  venus: BodyRef;
  earth: BodyRef;
  moon: BodyRef;
}
export default memo(function MatterTest() {
  const theme = useTheme().theme;
  const windowSize = useWindowSize();
  const scene = useRef();
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());
  const balls = useRef<Matter.Body[]>([]);
  const contentRef = useRef<HTMLElement | null>(null);
  //const boundingBoxes = useRef<Matter.Body[]>([]);
  const bodies = useRef<Matter.Body[]>([]);
  const contentBody = useRef<Matter.Body | null>(null);
  const render = useRef<Matter.Render>();
  const colors = useRef<number[]>([]);
  const sunBody = useRef<Matter.Body | null>(null);
  const solarBodies = useRef<SolarBodies>({
    sun: null,
    mercury: null,
    venus: null,
    earth: null,
    moon: null,
  });

  engine.current.timing.timeScale = 0.5;
  engine.current.world.gravity.scale = 0;

  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;

    render.current = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
        showBounds: true,
        showDebug: true,
      },
    });

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
        wrap: {
          min: { x: 0, y: 0 },
          max: {
            x: render.current.options.width,
            y: render.current.options.height,
          },
        },
      },
    };

    const centerX = cw / 2,
      centerY = ch / 2;
    solarBodies.current.sun = Bodies.circle(centerX, centerY, 50, {
      ...genSolarBodies,
      isStatic: true,
      mass: 3330,
      render: {
        fillStyle: "yellow",
      },
    });

    solarBodies.current.mercury = Bodies.circle(centerX, centerY + 90, 10, {
      ...genSolarBodies,
      isStatic: false,
      mass: 1,
      render: {
        fillStyle: "gray",
      },
    });

    Body.setVelocity(solarBodies.current.mercury, {
      x: 3.4,
      y: 0,
    });

    solarBodies.current.venus = Bodies.circle(centerX - 140, centerY, 15, {
      ...genSolarBodies,
      isStatic: false,
      mass: 16,
      render: {
        fillStyle: "orange",
      },
    });
    Body.setVelocity(solarBodies.current.venus, {
      x: 0,
      y: 2.7, //2.7
    });

    solarBodies.current.earth = Bodies.circle(centerX + 300, centerY, 20, {
      ...genSolarBodies,
      isStatic: true,
      mass: 20,
      render: {
        fillStyle: "blue",
      },
    });

    solarBodies.current.moon = Bodies.circle(centerX + 335, centerY, 3, {
      ...genSolarBodies,
      isStatic: false,
      mass: 0.2,
      render: {
        fillStyle: "white",
      },
    });
    Body.setVelocity(solarBodies.current.moon, {
      x: 0,
      y: 1.2,
    });
    const earthMoonConstraint = Constraint.create({
      bodyA: solarBodies.current.earth,
      bodyB: solarBodies.current.moon,
      stiffness: 0,
    });

    Composite.add(engine.current.world, [
      solarBodies.current.sun,
      solarBodies.current.mercury,
      solarBodies.current.venus,
      solarBodies.current.earth,
      solarBodies.current.moon,
      earthMoonConstraint,
    ]);

    // boundingBoxes.current = [
    //   Bodies.rectangle(cw / 2, -10, cw, 20, {
    //     isStatic: true,
    //     collisionFilter: { category: collisionFilters.walls },
    //   }),
    //   Bodies.rectangle(-10, ch / 2, 20, ch, {
    //     isStatic: true,
    //     collisionFilter: { category: collisionFilters.walls },
    //   }),
    //   Bodies.rectangle(cw / 2, ch + 10, cw, 20, {
    //     isStatic: true,
    //     collisionFilter: { category: collisionFilters.floor },
    //   }),
    //   Bodies.rectangle(cw + 10, ch / 2, 20, ch, {
    //     isStatic: true,
    //     collisionFilter: { category: collisionFilters.walls },
    //   }),
    // ];
    for (let i = 0; i < 0; i++) {
      const radius = 10 + Math.random() * 30;
      colors.current.push(Math.round(Math.random() * (darkColors.length - 1)));
      const body = Bodies.circle(
        Common.random(10, render.current.options.width),
        Common.random(10, render.current.options.height),
        radius,
        {
          mass: radius * 2,
          restitution: 0.9,
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
            wrap: {
              min: { x: 0, y: 0 },
              max: {
                x: render.current.options.width,
                y: render.current.options.height,
              },
            },
          },
          render: {
            fillStyle:
              theme === "dark"
                ? darkColors[colors.current[colors.current.length - 1]]
                : lightColors[colors.current[colors.current.length - 1]],
          },
        },
      );
      const speed = 5;
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * speed,
        y: (Math.random() - 0.5) * speed,
      });
      balls.current.push(body);
      Composite.add(engine.current.world, body);
    }

    //Composite.add(engine.current.world, [...balls.current]);

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

    render.current.mouse = Mouse.create(render.current.canvas);
    Runner.run(engine.current);
    Render.run(render.current);

    return () => {
      if (render.current) {
        render.current && Render.stop(render.current);
        render.current.canvas.remove();
        render.current.textures = {};
      }
      Composite.clear(engine.current.world, false);
      Engine.clear(engine.current);
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
    balls.current.forEach((ball, index) => {
      ball.render.fillStyle =
        theme === "dark"
          ? darkColors[colors.current[index]]
          : lightColors[colors.current[index]];
    });
  }, [theme]);

  const group = Body.nextGroup(true);

  const handleDown = () => {
    isPressed.current = true;
  };
  const handleUp = () => {
    isPressed.current = false;
  };

  const handleClick = (e) => {};

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
});
