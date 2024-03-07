import AstronomicalBody from "@/lib/matter/astronomicalBody";
import React, { useEffect } from "react";

interface AstronomicalBodyComponentProps {
  obj?: AstronomicalBody;
}

export const EarthComponent: React.FC<AstronomicalBodyComponentProps> = ({
  obj,
}: AstronomicalBodyComponentProps) => {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  useEffect(() => {
    if (obj) setIsLoaded(true);
  }, [obj]);
  if (!obj) return null;
  return (
    <div
      ref={bodyRef}
      id={obj.label}
      style={{
        position: "absolute",
        height: "30px",
        width: "30px",
        visibility: "hidden",
        borderRadius: "50%",
        backgroundColor: obj.fillStyle,
        left: obj.body?.position.x,
        top: obj.body?.position.y,
      }}
    />
  );
};
