"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logger from "@/lib/pino";
import useScrollPosition from "@/lib/hooks/scroll-position";
import { useSwipeable } from "react-swipeable";
import { useContext } from "react";
import { NavigationContext } from "@/lib/navigation-context";
import {
  AnimationStringType,
  EnterAnimationStringType,
  EnterAnimationStrings,
  ExitAnimationStringType,
  ExitAnimationStrings,
} from "./navigation-provider";

const SwipeableLayerLog = logger.child({ module: "SwipeableLayer" });

const SWIPE_THRESHOLD = 50;

const SwipeableLayer = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  SwipeableLayerLog.debug({ message: "render SwipeableLayer" });
  const pathname = usePathname();
  const {
    animateNavigation,
    setAnimateNavigation,
    animationString,
    handleRouteChange,
    swipePosition,
    setSwipePosition,
  } = useContext(NavigationContext);
  const { addToScroll, overScroll } = useScrollPosition();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e) => {
      SwipeableLayerLog.debug({ message: "user swiped left", e });
      if (e.deltaX < -SWIPE_THRESHOLD) {
        handleRouteChange("next");
      }
    },
    onSwipedRight: (e) => {
      SwipeableLayerLog.debug({ message: "user swiped right", e });
      if (e.deltaX > SWIPE_THRESHOLD) {
        handleRouteChange("prev");
      }
    },
    onSwiping: (e) => {
      SwipeableLayerLog.debug({
        message: "onSwiping",
        deltaX: e.deltaX,
        deltaY: e.deltaY,
      });
      if (Math.abs(e.deltaX) >= 15) {
        setSwipePosition(e.deltaX);
      }
      addToScroll(-e.deltaY);
    },
    onSwiped: (e) => {
      SwipeableLayerLog.debug("onSwiped", e);
      if (e.deltaX > -SWIPE_THRESHOLD && e.deltaX < SWIPE_THRESHOLD) {
        setSwipePosition(0);
      }
    },
    delta: 10,
    preventScrollOnSwipe: false,
    trackTouch: true,
    trackMouse: false,
    swipeDuration: Infinity,
  });

  useEffect(() => {
    if (animateNavigation) return;
    setSwipePosition(overScroll);
    if (overScroll <= -50) {
      handleRouteChange("next");
    } else if (overScroll >= 50) {
      handleRouteChange("prev");
    }
  }, [overScroll]);

  useEffect(() => {
    setSwipePosition(0);
  }, [pathname]);

  return (
    <div
      className={
        "relative z-5 w-full overflow-visible flex-grow pt-16 top-0 left-0 flex justify-center items-center transition-all duration-300 " +
        (animateNavigation ? animationString : "")
      }
      onAnimationEnd={() => {
        EnterAnimationStrings.includes(
          animationString as EnterAnimationStringType,
        )
          ? setAnimateNavigation(false)
          : null;
      }}
    >
      <div
        id="draggable"
        className="flex flex-col"
        {...swipeHandlers}
        style={{
          position: "relative",
          left: swipePosition,
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export function useSwipeableLayer() {
  const [animate, setAnimate] = useState(false);
  const [animateString, setAnimateString] = useState<AnimationStringType>("");
  return {
    animate,
    setAnimate,
    animateString,
    setAnimateString,
  };
}

export default SwipeableLayer;
