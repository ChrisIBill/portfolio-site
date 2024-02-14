import { AboutSection } from "../components/about-section"
import Footer from "../components/footer"

/* eslint-disable react/no-unescaped-entities */

export const metadata = {
    title: 'About',
    description: 'About page for Chris Billingham\'s portfolio website. Built with Next.JS and Tailwind CSS.',
}
export default function Home() {
    return (
        <div className="box-border px-4 sm:px-24
            min-h-fit w-screen flex flex-1 flex-col items-center justify-around">
            <AboutSection />
        </div >
    )
}


