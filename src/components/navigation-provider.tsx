"use client";
import {
  NavigationContext,
  NavigationDirection,
} from "@/lib/navigation-context";
import {
  InternalLink,
  InternalLinkType,
  InternalLinks,
  isInternalLink,
} from "./links";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import logger from "@/lib/pino";

const NavigationProviderLog = logger.child({ module: "NavigationProvider" });

export const ExitAnimationStrings = [
  "animate-slideOutDown",
  "animate-slideOutUp",
  "animate-fadeOut",
] as const;
export const EnterAnimationStrings = [
  "animate-slideInDown",
  "animate-slideInUp",
  "animate-fadeIn",
] as const;
const AnimationStrings = [
  ...EnterAnimationStrings,
  ...ExitAnimationStrings,
  "",
] as const;
export type ExitAnimationStringType = (typeof ExitAnimationStrings)[number];
export type EnterAnimationStringType = (typeof EnterAnimationStrings)[number];
export type AnimationStringType = (typeof AnimationStrings)[number] | "";

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [animateNavigation, setAnimateNavigation] = useState(false);
  const [animationString, setAnimationString] =
    useState<AnimationStringType>("");
  const [currentPage, setCurrentPage] = useState<InternalLinkType>(
    pathname as InternalLinkType,
  );
  const pageRefs = useRef<{ [key: string]: InternalLinkType }>({});

  const [swipePosition, setSwipePosition] = useState(0);

  const asyncDelayRouterSwitch = useCallback(
    async (
      url: InternalLinkType,
      delay = 500,
      callback?: () => void,
    ): Promise<void | (() => void)> => {
      NavigationProviderLog.debug({
        message: "asyncDelayRouterSwitch",
        url,
        delay,
      });
      return new Promise((resolve) => {
        NavigationProviderLog.debug("asyncDelayFn resolved promise");
        return setTimeout(() => {
          resolve(() => {
            router.push(url, { scroll: false });
            callback?.();
          });
        }, delay);
      }).then((res) => {
        NavigationProviderLog.debug({ message: "asyncDelayFn then ", res });
        if (res instanceof Function) {
          res();
        } else throw new Error("Invalid res", { cause: res });
      });
    },
    [router],
  );

  //Route Change Handlers
  const handleRouteChange = useCallback(
    async (direction?: NavigationDirection) => {
      NavigationProviderLog.debug({
        message: "handleRouteChange",
        direction,
        pageRefs: pageRefs.current,
      });
      if (direction === "next") {
        await asyncDelayRouterSwitch(pageRefs.current.next, 1000);
      } else if (direction === "prev") {
        await asyncDelayRouterSwitch(pageRefs.current.prev, 1000);
      }
    },
    [animateNavigation, router],
  );

  const handleRouteRequest = useCallback((route: string) => {
    NavigationProviderLog.debug({
      message: "handleRouteChange",
      route,
      pageRefs: pageRefs.current,
    });
    setAnimateNavigation(true);
    if (!isInternalLink(route))
      throw new Error("Invalid route", { cause: route });
    if (route === pageRefs.current.next)
      setAnimationString("animate-slideOutUp");
    else if (route === pageRefs.current.prev)
      setAnimationString("animate-slideOutDown");
    else setAnimationString("animate-fadeOut");
  }, []);

  useEffect(() => {
    if (!isInternalLink(pathname))
      throw new Error("Invalid pathname", { cause: pathname });
    const next =
      InternalLinks[
        (InternalLinks.indexOf(pathname) + 1) % InternalLinks.length
      ];
    const prev = InternalLinks.at(
      InternalLinks.indexOf(pathname) - 1,
    ) as InternalLinkType;
    NavigationProviderLog.debug({
      message: "setting current page",
      pathname,
      prev: prev,
      next: next,
      pageRefs: pageRefs.current,
    });
    setCurrentPage(pathname);
    pageRefs.current = {
      next: next,
      prev: prev,
    };
  }, [pathname]);

  useEffect(() => {
    if (pageRefs.current.prev) router.prefetch(pageRefs.current.prev);
    if (pageRefs.current.next) router.prefetch(pageRefs.current.next);
  }, [pageRefs.current.prev, pageRefs.current.next]);

  return (
    <NavigationContext.Provider
      value={{
        animateNavigation,
        setAnimateNavigation,
        animationString,
        setAnimationString,
        currentPage: currentPage,
        setCurrentPage: setCurrentPage,
        handleRouteChange,
        handleRouteRequest,
        swipePosition,
        setSwipePosition,
        routeIndex: InternalLinks.indexOf(currentPage),
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
