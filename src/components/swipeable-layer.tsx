"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logger from "@/lib/pino";
import useScrollPosition from "@/lib/hooks/scroll-position";
import { useSwipeable } from "react-swipeable";
import { useContext } from "react";
import { NavigationContext } from "@/lib/navigation-context";
import { AnimationStringType } from "./navigation-provider";

const SwipeableLayerLog = logger.child({ module: "SwipeableLayer" });

const SWIPE_THRESHOLD = 50;

const SwipeableLayer = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();
  const {
    animateNavigation,
    setAnimateNavigation,
    animationString,
    setAnimationString,
    handleRouteChange,
    swipePosition,
    setSwipePosition,
  } = useContext(NavigationContext);
  const { addToScroll, overScroll, resetOverScroll } = useScrollPosition();

  const swipeHandlers = useSwipeable({
    onSwipedDown: (e) => {
      SwipeableLayerLog.debug({ message: "user swiped down", e });
      if (e.deltaY > SWIPE_THRESHOLD) {
        setAnimateNavigation(true);
        setAnimationString("animate-slideOutUp");
        handleRouteChange("prev");
      }
    },
    onSwipedUp: (e) => {
      SwipeableLayerLog.debug({ message: "user swiped up", e });
      if (e.deltaY < -SWIPE_THRESHOLD) {
        setAnimateNavigation(true);
        setAnimationString("animate-slideOutDown");
        handleRouteChange("next");
      }
    },
    onSwiping: (e) => {
      SwipeableLayerLog.debug({
        message: "onSwiping",
        deltaX: e.deltaX,
        deltaY: e.deltaY,
      });
      if (Math.abs(e.deltaX) >= 15) {
        setSwipePosition(e.deltaY);
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
    SwipeableLayerLog.debug({
      message: "overScroll",
      overScroll,
      animateNavigation,
    });

    setSwipePosition(-overScroll);
    if (overScroll <= -50) {
      setAnimateNavigation(true);
      setAnimationString("animate-slideOutUp");
      handleRouteChange("prev");
    } else if (overScroll >= 50) {
      setAnimateNavigation(true);
      setAnimationString("animate-slideOutDown");
      handleRouteChange("next");
    }
  }, [overScroll]);

  useEffect(() => {
    SwipeableLayerLog.debug({
      message: "route change, reseting swipe state",
    });
    setAnimateNavigation(false);
    setAnimationString("");
    setSwipePosition(0);
  }, [pathname]);

  useEffect(() => {
    SwipeableLayerLog.debug({
      message: "Animation State Change",
      animateNavigation,
      animationString,
      swipePosition,
    });
  }, [animateNavigation, animationString, swipePosition]);

  return (
    <div
      className={
        "relative z-5 w-full overflow-visible flex-grow pt-16 top-0 left-0 flex justify-center items-center transition-all duration-300 " +
        (animateNavigation ? animationString : "")
      }
    >
      <div
        id="draggable"
        className="flex flex-col"
        {...swipeHandlers}
        style={{
          position: "relative",
          top: swipePosition,
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
