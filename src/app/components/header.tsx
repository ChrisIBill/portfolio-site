'use client'

import { GenericKeyValueObject } from "@/lib/interfaces"
import { usePathname } from "next/navigation"
import ThemeSwitcher from "./theme/theme-switcher"
import { Divider } from "@nextui-org/divider"
import React from "react"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from "@nextui-org/react";
import { SiteLinks, SiteLinkType } from "./links"
import { useIsLessThanXS } from "@/lib/hooks/resize"



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
            className="w-screen overflow-hidden px-0 h-16 flex-none"
        >
            <NavbarContent className="visible xs:invisible xs:w-0 gap-4" justify="start">
                <NavbarMenuToggle />
            </NavbarContent>
            <NavbarBrand className="hidden md:flex text-default-900">
                {/* TODO: Logo */}
            </NavbarBrand>
            <NavBarMenuItems pathname={pathname} />
            {/* {SiteLinks.map((item, index) => { */}
            {/*     return ( */}
            {/*         <NavbarItem */}
            {/*             isActive={item.link === pathname} */}
            {/*             key={item.text + '-menu-item'} */}
            {/*             className='flex nowrap items-center' */}
            {/*         > */}
            {/*             <Link */}
            {/*                 aria-label={item.text + ' menu item'} */}
            {/*                 title={item.label} */}
            {/*                 className='ml-2 text-inherit' */}
            {/*                 href={item.link} */}
            {/*                 isExternal={item.isExternal} */}
            {/*             > */}
            {/*                 {item.icon} */}
            {/*                 <div */}
            {/**/}
            {/*                     className={`${item.link === pathname ? '' : 'hidden'} ml-2 sm:flex text-inherit`} */}
            {/*                 > */}
            {/*                     {item.text} */}
            {/*                 </div> */}
            {/*             </Link> */}
            {/*         </NavbarItem> */}
            {/*     ) */}
            {/* })} */}
            <NavbarContent className="flex gap-4" justify="end">
                <ThemeSwitcher />
            </NavbarContent>
        </Navbar >
    );
}

const NavBarMenuItems = (props: {
    pathname: string
}) => {
    const lessThanXs = useIsLessThanXS()
    const [isClient, setIsClient] = React.useState(false)

    React.useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient)
        return <></>
    return lessThanXs ? <ListMenuItems pathname={props.pathname} />
        : <ContentMenuItems pathname={props.pathname} />
}

const ListMenuItems = (props: any) => {
    return (
        <NavbarMenu className='flex flex-col gap-4'>
            {SiteLinks.map((item) => {
                return (
                    <NavbarMenuItem
                        isActive={item.link === props.pathname}
                        key={item.text + '-menu-item'}
                        className='flex nowrap items-center'
                    >
                        <MenuItemLink item={item} pathname={props.pathname} />
                    </NavbarMenuItem>
                )
            })}
        </NavbarMenu>
    )
}

const ContentMenuItems = (props: any) => {
    return (
        <NavbarContent className='flex gap-4' justify="center">
            {SiteLinks.map((item) => {
                return (
                    <NavbarItem
                        isActive={item.link === props.pathname}
                        key={item.text + '-menu-item'}
                        className='flex nowrap items-center'
                    >
                        <MenuItemLink item={item} pathname={props.pathname} />
                    </NavbarItem>
                )
            })}
        </NavbarContent >
    )
}
const MenuItemLink = (props: {
    item: SiteLinkType
    pathname: string
}) => {
    return (
        <Link
            aria-label={props.item.text + ' menu item'}
            title={props.item.label}
            className='ml-2 text-inherit'
            href={props.item.link}
            isExternal={props.item.isExternal}
        >
            {props.item.icon}
            <div
                className={`${props.item.link === props.pathname ? '' : 'inline xs:hidden sm:inline'} ml-2 sm:flex text-inherit`}
            >
                {props.item.text}
            </div>
        </Link>
    )
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
