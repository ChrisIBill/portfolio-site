"use client";
import { useEffect, useRef, memo } from "react";
import {
  Engine,
  Render,
  Body,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
  Runner,
} from "matter-js";
import cloth from "@/lib/cloth";
import useRandomInterval from "@/lib/hooks/use-random-interval";
import logger from "@/lib/pino";
import { useTheme } from "next-themes";
import { useWindowSize } from "@/lib/hooks/resize";

const NUM_CLOTH_COLS = 20;
const collisionFilters = {
  walls: 0x0001,
  floor: 0x0002,
  balls: 0x0004,
  mouse: 0x0008,
  content: 0x0016,
} as const;

const MatterLogger = logger.child({ module: "Matter Canvas" });

export default memo(function MatterTest() {
  const windowSize = useWindowSize();
  const scene = useRef();
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());
  const balls = useRef<Body[]>([]);
  const contentRef = useRef<HTMLElement | null>(null);
  const boundingBoxes = useRef<Body[]>([]);
  const contentBody = useRef<Body | null>(null);
  const render = useRef<Render>();
  engine.current.timing.timeScale = 0.5;
  engine.current.world.gravity.y = 0.5;

  // const ropeA = Composites.stack(0, 50, 8, 1, 10, 10, (x, y) => {
  //   return Bodies.rectangle(x, y, 50, 20, {
  //     collisionFilter: { group: Body.nextGroup(true) },
  //   });
  // });

  //const canvasCloth = cloth(
  //  100, //x
  //  0, //y
  //  NUM_CLOTH_COLS, //columns
  //  16, //rows
  //  20, //column gap
  //  20, //row gap
  //  false, //cross bracing
  //  20, //particle radius
  //  {},
  //  {},
  //);

  //prevent the cloth from falling
  //for (var i = 0; i < NUM_CLOTH_COLS; i++) {
  //  canvasCloth.bodies[i].isStatic = true;
  //}

  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;
    // if (contentRef.current === null) {
    //   contentRef.current = document.getElementById("collidable-wrapper");
    //   if (contentRef.current === null) {
    //     MatterLogger.error({
    //       message: "Content ref is null",
    //       contentRef: contentRef.current,
    //     });
    //     return;
    //   }
    // }
    // contentBody.current = Bodies.rectangle(
    //   contentRef.current.offsetLeft + contentRef.current.clientWidth / 2,
    //   contentRef.current.getBoundingClientRect().top +
    //     contentRef.current.clientHeight / 2,
    //   contentRef.current.getBoundingClientRect().width,
    //   contentRef.current.clientHeight,
    //   {
    //     isStatic: true,
    //     collisionFilter: { category: collisionFilters.content },
    //     render: {
    //       lineWidth: 2,
    //       strokeStyle: "red",
    //       fillStyle: "transparent",
    //     },
    //   },
    // );
    boundingBoxes.current = [
      Bodies.rectangle(cw / 2, -10, cw, 20, {
        isStatic: true,
        collisionFilter: { category: collisionFilters.walls },
      }),
      Bodies.rectangle(-10, ch / 2, 20, ch, {
        isStatic: true,
        collisionFilter: { category: collisionFilters.walls },
      }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, {
        isStatic: true,
        collisionFilter: { category: collisionFilters.floor },
      }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, {
        isStatic: true,
        collisionFilter: { category: collisionFilters.walls },
      }),
    ];

    render.current = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
        showBounds: true,
      },
    });

    // Composite.add(engine.current.world, [
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
    //   contentBody.current,
    // ]);

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
      //render.canvas = null;
      //render.context = null;
    };
  }, []);

  //Handle window mounting and resizing
  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;
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
        boundingBoxes: boundingBoxes.current,
      });
      Composite.remove(engine.current.world, [
        boundingBoxes.current[0],
        boundingBoxes.current[1],
        boundingBoxes.current[2],
        boundingBoxes.current[3],
        contentBody.current,
      ]);
    }
    contentBody.current = Bodies.rectangle(
      contentRef.current.offsetLeft + contentRef.current.clientWidth / 2,
      contentRef.current.getBoundingClientRect().top +
        contentRef.current.clientHeight / 2,
      contentRef.current.getBoundingClientRect().width,
      contentRef.current.clientHeight,
      {
        isStatic: true,
        collisionFilter: { category: collisionFilters.content },
        render: {
          lineWidth: 2,
          strokeStyle: "red",
          fillStyle: "transparent",
        },
      },
    );
    render.current.bounds.max.x = cw;
    render.current.bounds.max.y = ch;
    render.current.canvas.width = cw;
    render.current.canvas.height = ch;
    render.current.options.width = cw;
    render.current.options.height = ch;

    Render.world(render.current);
    Composite.add(engine.current.world, [
      boundingBoxes.current[0],
      boundingBoxes.current[1],
      boundingBoxes.current[2],
      boundingBoxes.current[3],
      contentBody.current,
    ]);

    return () => {
      //if (render.current && contentBody.current) {
      //  Composite.add(engine.current.world, [
      //    ...boundingBoxes.current,
      //    contentBody.current,
      //  ]);
      //}
      //   MatterLogger.info({
      //     message: "Cleaning up during resize event",
      //   });
      //   if (render.current) {
      //     render.current && Render.stop(render.current);
      //     render.current.canvas.remove();
      //     render.current.textures = {};
      //   }
      //   Composite.clear(engine.current.world, false);
      //   Engine.clear(engine.current);
      //   //render.canvas = null;
      //   //render.context = null;
    };
  }, [windowSize]);

  useBallsManager({ engine });
  // useRandomInterval(
  //   () => {
  //     balls.current.push(
  //       Bodies.circle(
  //         Math.random() * window.innerWidth,
  //         -10,
  //         10 + Math.random() * 30,
  //         {
  //           mass: 10,
  //           restitution: 0.9,
  //           friction: 0.005,
  //           render: {
  //             fillStyle: lightColors[0],
  //           },
  //         },
  //       ),
  //     );
  //     Composite.add(engine.current.world, [
  //       balls.current[balls.current.length - 1],
  //     ]);
  //     setTimeout(() => {
  //       Composite.remove(engine.current.world, [balls.current[0]]);
  //       balls.current.shift();
  //     }, 10000);
  //   },
  //   1000,
  //   2000,
  // );
  const group = Body.nextGroup(true);

  const handleDown = () => {
    isPressed.current = true;
  };
  const handleUp = () => {
    isPressed.current = false;
  };

  const handleClick = (e) => {};
  //const handleAddCircle = (e) => {
  //  if (isPressed.current) {
  //    const ball = Bodies.circle(
  //      e.clientX,
  //      e.clientY,
  //      10 + Math.random() * 30,
  //      {
  //        mass: 10,
  //        restitution: 0.9,
  //        friction: 0.005,
  //        render: {
  //          fillStyle: "#0000ff",
  //        },
  //      },
  //    );
  //    Composite.add(engine.current.world, [ball]);
  //  }
  //};

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

const darkColors = ["#A0D7E3", "#FFD470"] as const;
const lightColors = ["#074453", "#C48900"] as const;

const MAX_BALLS = 20 as const;

interface CustomBall extends Body {
  colorNum: number;
}

const BallManagerLog = logger.child({ module: "Ball Manager" });

function useBallsManager(props: { engine: React.MutableRefObject<Engine> }) {
  const theme = useTheme().theme;
  const balls = useRef<Body[]>([]);
  const colors = useRef<number[]>([]);
  balls.current.forEach((ball) => {});
  useRandomInterval(
    () => {
      colors.current.push(Math.round(Math.random() * (darkColors.length - 1)));
      BallManagerLog.info({
        message: "Adding new ball",
        color: colors.current[colors.current.length - 1],
      });
      const collisionController = Math.round(Math.random() * 32);
      const mask1 = collisionController % 2 > 0;
      const mask2 = collisionController % 4 > 2;
      const mask3 = collisionController % 8 > 4;
      const mask4 = collisionController % 16 > 8;
      const mask5 = collisionController % 32 > 16;
      BallManagerLog.debug({
        message: "Collision controller",
        controller: [mask1, mask2, mask3, mask4, mask5],
      });
      balls.current.push(
        Bodies.circle(
          Math.random() * window.innerWidth,
          -10,
          10 + Math.random() * 30,
          {
            mass: 10,
            restitution: 0.9,
            friction: 0.005,
            collisionFilter: {
              category: collisionFilters.balls,
              mask:
                (mask1 ? collisionFilters.walls : 0) |
                (mask2 ? collisionFilters.floor : 0) |
                (mask3 ? collisionFilters.balls : 0) |
                (mask4 ? collisionFilters.mouse : 0) |
                (mask5 ? collisionFilters.content : 0),
            },
            render: {
              fillStyle:
                theme === "dark"
                  ? darkColors[colors.current[colors.current.length - 1]]
                  : lightColors[colors.current[colors.current.length - 1]],
            },
          },
        ),
      );
      Composite.add(props.engine.current.world, [
        balls.current[balls.current.length - 1],
      ]);
      if (balls.current.length > MAX_BALLS) {
        Composite.remove(props.engine.current.world, [balls.current[0]]);
        balls.current.shift();
      }
    },
    1000,
    2000,
  );

  useEffect(() => {
    BallManagerLog.info({
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
}

const useBallManager = (props: { engine: React.MutableRefObject<Engine> }) => {
  const theme = useTheme().theme;
  const color = useRef(Math.round(Math.random() * darkColors.length - 1));
  const ball = useRef<Body>();

  useEffect(() => {
    ball.current = Bodies.circle(
      Math.random() * window.innerWidth,
      -10,
      10 + Math.random() * 30,
      {
        mass: 10,
        restitution: 0.9,
        friction: 0.005,
        render: {
          fillStyle: lightColors[color.current],
        },
      },
    );
  }, []);

  useEffect(() => {
    ball.current.render.fillStyle =
      theme === "dark" ? darkColors[color.current] : lightColors[color.current];
  }, [theme]);
  return ball;
};
