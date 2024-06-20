import BioComponent from "../bio";

export default function HomeComponent() {
  return (
    <div className="relative box-border px-4 sm:px-24 top-4 left-0 right-0 h-fit min-w-fit w-screen flex justify-center">
      <div
        id="collidable-wrapper"
        className="relative w-fit h-fit justify-center"
      >
        <BioComponent />
      </div>
      {/* <MatterTest /> */}
    </div>
  );
}
