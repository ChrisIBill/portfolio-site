'use server'
import { Link } from "@nextui-org/react"
import React from "react";
import { SiteLinks } from "./links";

const MainMenu: React.FC = () => {

    return (
        <div className="relative flex flex-col w-full min-h-fit items-center justify-center transition-transform">
            <ul className="relative top-8 flex flex-col w-fit h-fit">
                {
                    SiteLinks.map((item, index) => {
                        return (
                            <li
                                key={item.text + '-menu-item'}
                                className='flex'
                                title={item.label}
                            //TODO: why doesnt this work to add margin to icons?
                            //css={css`
                            //&:nth-child(1) {
                            //    margin-left: 8rem;
                            //}
                            //`}
                            >
                                {item.icon}
                                <Link
                                    className='ml-2'
                                    aria-label={item.text + ' menu item'}
                                    href={item.link}>{item.text}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default MainMenu
