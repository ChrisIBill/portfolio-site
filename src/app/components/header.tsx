'use client'

import { GenericKeyValueObject } from "@/lib/interfaces"
import { usePathname } from "next/navigation"
import ThemeSwitcher from "./theme/theme-switcher"
import { Divider } from "@nextui-org/divider"
import React from "react"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from "@nextui-org/react";
import { SiteLinks, SiteLinkType } from "./links"
import { useIsLessThanXS } from "@/lib/hooks/resize"
import dynamic from "next/dynamic"



const PathnamesToDisplayTitles: GenericKeyValueObject<string> = {
    '/': 'Home',
    '/about': 'About',
    '/projects': 'Projects',
    '/contact': 'Contact'
}

const DynamicNavbarMenu = dynamic(() => import('./header-menu'), {
    ssr: false,
})

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
            className="w-screen overflow-hidden px-0 h-16 flex-none"
        >
            <NavbarContent className="visible xs:invisible xs:w-0 gap-4 text-default-900" justify="start">
                <NavbarMenuToggle className="text-default-900" />
            </NavbarContent>
            <NavbarBrand className="hidden md:flex text-default-900">
                {/* TODO: Logo */}
            </NavbarBrand>
            <DynamicNavbarMenu pathname={pathname} />
            <NavbarContent className="flex gap-4" justify="end">
                <ThemeSwitcher />
            </NavbarContent>
        </Navbar >
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
