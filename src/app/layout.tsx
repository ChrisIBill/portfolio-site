import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "./globals.scss";
import { Providers } from "@/lib/providers";
import GoogleAnalytics from "./google-analytics";
import { infolog } from "@/lib/pino";
import SwipeableLayer from "@/components/swipeable-layer";
import NextHeader from "@/components/header";
import Footer from "@/components/footer";
import CustomPagination from "@/components/pagination";
import { Preloads } from "@/components/pages/preloads";
import MatterTest from "@/components/matter-test";

const font = Lato({ weight: "400", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "dark",
};

export const metadata: Metadata = {
  generator: "Next.JS",
  authors: { name: "Christopher Billingham" },
  creator: "Christopher Billingham",
  publisher: "Christopher Billingham",
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  keywords:
    "chris billingham, chris, christopher, billingham, portfolio, website, web development, software engineering, react, next.js, tailwind css, chris billingham, christopher billingham, tailwind, full stack, full stack engineer, web developer, developer, javascript, typescript, .net, c-sharp, c#, vite, front end, front end developer",
  metadataBase: new URL("https://www.christopher-billingham.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    template: "%s | Chris Billingham",
    default: "Chris Billingham",
  },
  description:
    "Software Engineer and Web Developer with a B.S. in Computer Science. Built with Next.JS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  infolog("rendering layout");
  return (
    <html
      lang="en"
      id="root"
      className="bg-transparent overflow-visible"
      suppressHydrationWarning
    >
      <body>
        <div
          id="background-layer-light"
          className="background-layer transition-colors before:bg-gradient-to-b dark:before:from-default-200 dark:before:to-default-300 before:from-default-800 before:to-default-700 before:opacity-0 dark:before:opacity-100"
        >
          <div
            id="background-layer-dark"
            className="background-layer transition-colors before:bg-gradient-to-b before:from-default-200 before:to-default-300 dark:before:from-default-800 dark:before:to-default-700 dark:before:opacity-0 before:opacity-100"
          >
            {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
              <GoogleAnalytics
                ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}
              />
            ) : null}
            <Providers className="absolute z-10 min-h-screen flex flex-col justify-between opacity-100 visible overflow-visible">
              <main className={font.className}>
                <NextHeader />
                <div
                  id="scrollable"
                  className="w-screen h-screen overflow-y-hidden overflow-x-hidden xs:overflow-x-hidden flex flex-col fixed"
                >
                  <div
                    id="scrollable-content"
                    className="absolute min-h-screen flex flex-col"
                  >
                    <MatterTest />
                    <SwipeableLayer className="relative z-5 flex-grow flex overflow-x-hidden overflow-y-hidden">
                      <Preloads>
                        <div
                          className={
                            font.className +
                            " relative z-10 box-border flex justify-center"
                          }
                        >
                          {children}
                        </div>
                      </Preloads>
                    </SwipeableLayer>
                    {/* <div id="pagination-filler-item" className="h-16"></div> */}
                  </div>
                </div>
              </main>
              <CustomPagination />
              <Footer />
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
//bg-gradient-to-b from-default-200 to-default-300 dark:from-default-800 dark:to-default-700
//light:before:from-default-800 light:before:to-default-700
