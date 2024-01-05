import { Link } from "@nextui-org/react";

const Footer = () => {
    return (
        <footer className="absolute bottom-0">
            <div className="flex w-screen justify-center">
                <span className="text-default-500 whitespace-normal mr-1">Made with</span>
                <Link href="https://nextjs.org/">
                    Next.JS
                </Link>
            </div>
        </footer>
    );
}
export default Footer;
