import { Link } from "@nextui-org/react";
import CustomPagination from "./pagination";

const Footer = () => {
    return (
        <footer className="flex-grow-0 w-full">
            <CustomPagination />
            <div className="flex justify-center text-center align-middle">
                <p className="text-default-500 inline-flex items-center relative text-sm whitespace-normal mr-1">Made with</p>
                <Link underline='hover' href="https://nextjs.org/" className='text-sm'>
                    Next.JS
                </Link>
            </div>
        </footer>
    );
}
export default Footer;
