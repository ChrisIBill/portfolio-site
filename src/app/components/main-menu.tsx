'use server'
import { Link } from "@nextui-org/react"
import React from "react";
import { IoInformationCircleSharp, IoConstruct, IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";

const MainMenu: React.FC = () => {
    const menuItems = [
        {
            icon: <IoInformationCircleSharp className='h-full text-default-900  self-center' />,
            link: '/about',
            text: 'About'
        },
        {
            icon: <IoConstruct className='h-full text-default-900 self-center' />,
            link: '/projects',
            text: 'Projects'
        },
        {
            icon: <IoLogoLinkedin className='h-full text-default-900 self-center' />,
            link: 'https://www.linkedin.com/in/chris-billingham-7781a1180/',
            text: 'LinkedIn'
        },
        {
            icon: <IoLogoGithub className='h-full text-default-900 self-center' />,
            link: 'https://www.github.com/ChrisIBill',
            text: 'Github'
        },
    ]

    return (
        <div className="relative flex flex-col w-full min-h-fit items-center justify-center transition-transform animate-slideInRight">
            <ul className="relative top-8 flex flex-col w-fit h-fit">
                {
                    menuItems.map((item, index) => {
                        return (
                            <li
                                key={item.text + '-menu-item'}
                                className='flex'
                            //TODO: why doesnt this work to add margin to icons?
                            //css={css`
                            //&:nth-child(1) {
                            //    margin-left: 8rem;
                            //}
                            //`}
                            >
                                {item.icon}
                                <Link className='ml-2' href={item.link}>{item.text}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default MainMenu
