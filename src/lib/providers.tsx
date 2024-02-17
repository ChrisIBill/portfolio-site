"use client";

import RootStyleRegistry from "./emotion";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { IconContext } from "react-icons";
import { NavigationProvider } from "@/app/components/navigation-provider";
import { infolog } from "./pino";

export function Providers({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const router = useRouter();

  infolog("rendering Providers");

  return (
    <NextUIProvider className={className} navigate={router.push}>
      <ThemeProvider defaultTheme="dark">
        <IconContext.Provider value={{ className: "text-black" }}>
          <RootStyleRegistry>
            <NavigationProvider>{children}</NavigationProvider>
          </RootStyleRegistry>
        </IconContext.Provider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
