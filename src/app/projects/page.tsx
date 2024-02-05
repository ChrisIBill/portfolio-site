import { Divider, Link } from "@nextui-org/react"
import { TiWeatherDownpour } from "react-icons/ti";
import { IoGlobeOutline, IoLogoGithub } from "react-icons/io5"
import { RiGlobeLine } from "react-icons/ri"
import { PiGlobeBold } from "react-icons/pi"

export const metadata = {
    title: 'Projects',
    description: 'Chris Billingham\'s portfolio website. Built with Next.JS and Tailwind CSS.',
}

export default function Home() {
    return (
        <div className="px-4 sm:px-24 w-screen flex flex-1 flex-col items-center justify-around transition-all animate-fadeIn">
            <ProjectComponent
                title='Drizzle (Yet Another Weather App)'
                description='A weather app constructed with Next.JS.
                Uses Open-Meteo API for weather data and googles location apis. Deployed on Vercel.'
                url='https://drizzleweather.vercel.app/'
                icon={<TiWeatherDownpour className='h-full text-default-900 self-center mx-2' />}
                githubURL='https://github.com/ChrisIBill/next-weather-app'
            />
            <Divider />
            <ProjectComponent
                title='Multiplayer Checkers App'
                description='A multiplayer checkers app built with React and Express.
                Uses Socket.IO for real-time communication between players.'
                githubURL='https://github.com/ChrisIBill/checkers-app'
            />
            <Divider />

            <ProjectComponent
                title='Simple Compiler'
                description='A simple compiler built with C, Flex and Bison. Compiles from TS-13 to C.'
                githubURL='https://github.com/ChrisIBill/simple-compiler'
            />
        </div>
    )
}

interface ProjectComponentProps {
    title: string,
    description: string,
    githubURL: string
    icon?: React.ReactNode,
    url?: string
}

const ProjectComponent: React.FC<ProjectComponentProps> = (props) => {
    return (
        <div className="flex flex-col items-center justify-around">
            <h3 className="flex justify-around text-xl my-4 text-foreground-900 self-center">
                {props.icon}
                {props.title}
            </h3>
            <div className='flex flex-col flex-1 justify-center text-foreground-500 text-center items-center'>
                <p className='mb-2'>
                    {props.description}
                </p>
                <div className='flex'>
                    <span className={`flex mx-2 ${props.url ? '' : 'my-2'}`}>
                        <IoLogoGithub className='h-full text-default-900 self-center mx-2' />
                        <Link underline='hover' href={props.githubURL}>Github</Link>
                    </span>
                    {props.url && <span className="flex m-2">
                        <PiGlobeBold className='h-full text-default-900 self-center mx-2' />
                        <Link underline='hover' href={props.url}>Live</Link>
                    </span>}
                </div>
            </div>
        </div >
    )
}
