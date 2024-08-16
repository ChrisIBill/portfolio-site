import { Link } from "@nextui-org/react";

const Footer = () => {
  return (
    <footer className="absolute bottom-0 flex-grow-0 w-[100vw]">
      <div className="flex justify-center text-center align-middle">
        <p className="text-default-500 inline-flex items-center relative text-sm whitespace-normal mr-1">
          Made with
        </p>
        <Link underline="hover" href="https://nextjs.org/" className="text-sm">
          Next.JS
        </Link>
      </div>
    </footer>
  );
};
export default Footer;
