"use client";
import { AboutSkeleton } from "@/components/pages/about";
import { HomeSkeleton } from "@/components/pages/home";
import { ProjectsSkeleton } from "@/components/pages/projects";
import { getNextPage, getPreviousPage } from "@/lib/lib";
import { NavigationContext } from "@/lib/navigation-context";
import dynamic from "next/dynamic";
import React from "react";
import { useContext } from "react";
import { InternalLinks } from "../links";

const DynamicAboutPage = dynamic(() => import("@/components/pages/about"), {
  loading: () => <AboutSkeleton />,
});
const DynamicHomePage = dynamic(() => import("@/components/pages/home"), {
  loading: () => <HomeSkeleton />,
});
const DynamicProjectsPage = dynamic(
  () => import("@/components/pages/projects"),
  {
    loading: () => <ProjectsSkeleton />,
  },
);

// React.memo(function PreviousPage() {
//   const { routeIndex } = useContext(NavigationContext);
//   console.log("Rendering Previous Page: ", routeIndex);
//   return getPreviousPage(routeIndex);
// });
//
// React.memo(function NextPage() {
//   console.log("Rendering Next Page: ", routeIndex);
//   return getNextPage(routeIndex);
// });

export const Preloads = ({ children }: { children: React.ReactNode }) => {
  const { routeIndex } = useContext(NavigationContext);

  const PagesArray = [
    <DynamicHomePage key={0} />,
    <DynamicAboutPage key={1} />,
    <DynamicProjectsPage key={2} />,
  ];
  function getNextPage(currentPage: number) {
    return PagesArray[(currentPage + 1) % InternalLinks.length];
  }
  function getPreviousPage(currentPage: number) {
    return PagesArray[
      currentPage > 0 ? currentPage - 1 : InternalLinks.length - 1
    ];
  }
  const PrevPage = getPreviousPage(routeIndex);
  const NextPage = getNextPage(routeIndex);
  return (
    <div className="absolute flex flex-col justify-between items-center h-[150vh] top-[50%] translate-y-[-50%]">
      <div className="flex flex-col justify-center items-center">
        {PagesArray[(routeIndex + 1) % InternalLinks.length]}
      </div>
      {children}
      <div className="flex flex-col justify-center items-center">
        {PagesArray[routeIndex > 0 ? routeIndex - 1 : InternalLinks.length - 1]}
      </div>
    </div>
  );
  return <></>;
};
