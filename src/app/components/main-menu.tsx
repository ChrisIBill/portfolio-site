import { Link } from "@nextui-org/link"
import { css } from "@emotion/react"
import React from "react";
import { IoInformationCircleSharp, IoConstruct, IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";
import { IconContext } from "react-icons/lib/esm/iconContext";

const MainMenu: React.FC = () => {
    const menuItems = [
        <AboutComponent key='menu-about-item' />,
        <ProjectsComponent key='menu-projects-item' />,
        <LinkedInComponent key='menu-linkedin-item' />,
        <GithubComponent key='menu-github-item' />
    ]
    return (
        <div className="relative flex flex-col w-full min-h-fit items-center justify-center transition-transform animate-slideInRight">
            <ul className="relative top-8 flex flex-col w-fit h-fit">
                {
                    menuItems.map((item, index) => {
                        return (
                            <li
                                key={item.key}
                                className='flex'
                            >
                                {item}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

const AboutComponent: React.FC = () => {
    return (
        <React.Fragment>
            <IoInformationCircleSharp className='text-default-800 h-full self-center' />
            <Link href='/about'>About</Link>
        </React.Fragment>
    )
}
const ProjectsComponent: React.FC = () => {
    return (
        <React.Fragment>
            <IoConstruct className='text-default-800 h-full self-center' />
            <Link href='/projects'>Projects</Link>
        </React.Fragment>
    )
}
const LinkedInComponent: React.FC = () => {
    return (
        <React.Fragment>
            <IoLogoLinkedin className='text-default-800 h-full self-center' />
            <Link href='https://www.linkedin.com/in/chris-billingham-7781a1180/'>LinkedIn</Link>
        </React.Fragment>
    )
}
const GithubComponent: React.FC = () => {
    return (
        <React.Fragment>
            <IoLogoGithub className='text-default-800 h-full self-center' />
            <Link href='https://github.com/ChrisIBill'>Github</Link>
        </React.Fragment>
    )
}


export default MainMenu
