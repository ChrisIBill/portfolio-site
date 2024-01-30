'use client'

import { GenericKeyValueObject } from "@/lib/interfaces"
import { usePathname } from "next/navigation"
import ThemeSwitcher from "./theme/theme-switcher"
import { Divider } from "@nextui-org/divider"
import React from "react"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { SiteLinks } from "./links"



const PathnamesToDisplayTitles: GenericKeyValueObject<string> = {
    '/': 'Home',
    '/about': 'About',
    '/projects': 'Projects',
    '/contact': 'Contact'
}


const NextHeader = () => {
    const pathname = usePathname()
    return (
        <Navbar
            classNames={{
                item: [
                    //"transition-colors",
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "data-[active=true]:after:content-['']",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-0",
                    "data-[active=true]:after:left-0",
                    "data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[2px]",
                    "data-[active=true]:after:rounded-[2px]",
                    "data-[active=true]:after:bg-primary",
                    "data-[active=true]:text-primary",
                ],
            }}
            className="w-screen overflow-hidden px-0"
        >
            <NavbarBrand className="hidden md:flex text-default-900 min-w-fit min-h-fit">
                {/* TODO: Logo */}
            </NavbarBrand>
            <NavbarContent className="flex gap-4 min-w-fit" justify="center">
                {SiteLinks.map((item, index) => {
                    return (
                        <NavbarItem
                            isActive={item.link === pathname}
                            key={item.text + '-menu-item'}
                            className='flex nowrap items-center'
                        >
                            <Link
                                aria-label={item.text + ' menu item'}
                                title={item.label}
                                className='ml-2 text-inherit'
                                href={item.link}
                                isExternal={item.isExternal}
                            >
                                {item.icon}
                                <div

                                    className={`${item.link === pathname ? '' : 'hidden'} ml-2 sm:flex text-inherit`}
                                >
                                    {item.text}
                                </div>
                            </Link>
                        </NavbarItem>
                    )
                })}
            </NavbarContent>
            <NavbarContent className="flex gap-4" justify="end">
                <ThemeSwitcher />
            </NavbarContent>
        </Navbar>
    );
}

const Header = () => {
    const pathname = usePathname()
    return (
        <header className='flex flex-col fixed w-screen z-50 text-default-900'>
            <div className='flex justify-between'>
                <div>
                    {/* Filler Element */}
                </div>
                <div className={'absolute w-4 mx-4 transition-all duration-1000'} style={{
                    left: pathname === '/' ? '50%' : '0',
                }}>
                    {pathname === '/' ? <h1 className='relative text-3xl text-center mt-2 w-0 right-12'>Home</h1> : <Link href='/' className="text-3xl mt-2 transition-transform">Home</Link>}
                </div>
                <h1 className='text-3xl mt-2 w-4 self-center duration-1000' style={{
                    visibility: pathname === '/' ? 'hidden' : 'visible',
                    transitionDelay: pathname === '/' ? '0s' : '300ms',
                    transitionDuration: pathname === '/' ? '0s' : '4s'
                }}>{PathnamesToDisplayTitles[pathname]}</h1>
                <ThemeSwitcher />
            </div>
            <Divider className='mt-4 w-3/4 self-center bg-gradient-to-r from-default-100/0 via-default-900/50 to-default-100/0' />
        </header>
    )
}

export default NextHeader
