import { InternalLinkType } from "@/components/links";
import { AnimationStringType } from "@/components/navigation-provider";
import React from "react";
import { createContext } from "react";

export type NavigationDirection = "next" | "prev";

export interface NavigationContextType {
  animateNavigation: boolean;
  setAnimateNavigation: (value: boolean) => void;
  animationString: string;
  setAnimationString: (value: string) => void;
  currentPage: string;
  setCurrentPage: (value: string) => void;
  handleRouteChange: (direction?: NavigationDirection) => void;
  handleRouteRequest: (route: InternalLinkType) => void;
  swipePosition: number;
  setSwipePosition: (value: number) => void;
  routeIndex: number;
}

export const NavigationContext = createContext({
  animateNavigation: false,
  setAnimateNavigation: (value: boolean) => {},
  animationString: "",
  setAnimationString: (value: AnimationStringType) => {},
  currentPage: "/" as InternalLinkType,
  setCurrentPage: (value: InternalLinkType) => {},
  handleRouteChange: (direction?: NavigationDirection) => {},
  handleRouteRequest: (route: InternalLinkType) => {},
  swipePosition: 0,
  setSwipePosition: (value: number) => {},
  routeIndex: 0,
});
