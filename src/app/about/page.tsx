import { infolog } from "@/lib/pino";
import { AboutSection } from "../components/about-section";

/* eslint-disable react/no-unescaped-entities */

export const metadata = {
  title: "About",
  description:
    "About page for Chris Billingham's portfolio website. Built with Next.JS and Tailwind CSS.",
};
export default function Home() {
  infolog("rendering about page");
  return (
    <div
      className="box-border px-4 sm:px-24
            min-h-fit w-screen flex flex-1 flex-col items-center justify-around"
    >
      <AboutSection />
    </div>
  );
}
