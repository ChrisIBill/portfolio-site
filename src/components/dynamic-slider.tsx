"use client";
import { useMemo } from "react";
import BioComponent from "./bio";

interface SliderProps {
  children: React.ReactNodeArray;
  // params: { slug: string };
}
const DynamicSlider: React.FC<SliderProps> = ({ children }) => {
  console.log("Children of DynamicSlider: ", children);
  // console.log("Params of DynamicSlider: ", params);

  return <div className="flex flex-row"></div>;
};

export default DynamicSlider;
