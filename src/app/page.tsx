import { infolog } from "@/lib/pino";
import BioComponent from "./components/bio";
import MatterTest from "@/app/components/matter-test";

export const metadata = {
  title: {
    absolute: "Portfolio | Chris Billingham",
  },
  description:
    "Christopher Billingham's portfolio website. Built with Next.JS and Tailwind CSS.",
};

export default function Home() {
  infolog("rendering home");
  return (
    <div className="relative box-border px-4 sm:px-24 top-4 left-0 right-0 h-fit min-w-fit w-screen flex justify-center">
      <div
        id="collidable-wrapper"
        className="relative w-fit h-fit justify-center"
      >
        <BioComponent />
      </div>
      <MatterTest />
    </div>
  );
}
