'use client'

import { GenericKeyValueObject } from "@/lib/interfaces"
import { usePathname } from "next/navigation"
import ThemeSwitcher from "./theme/theme-switcher"
import { Divider } from "@nextui-org/divider"
import React from "react"
import { Link } from "@nextui-org/react"
import { IoChevronBackSharp } from "react-icons/io5"

const PathnamesToDisplayTitles: GenericKeyValueObject<string> = {
    '/': 'Home',
    '/about': 'About',
    '/projects': 'Projects',
    '/contact': 'Contact'
}

const Header = () => {
    const pathname = usePathname()
    return (
        <header className='flex flex-col fixed w-screen z-50'>
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

export default Header
