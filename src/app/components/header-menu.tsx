'use client'
import '@/app/globals.scss'
import { SiteLinks, SiteLinkType } from "./links"
import { Link, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem } from "@nextui-org/react"

import React, { memo } from "react"
import { useIsLessThanXS } from "@/lib/hooks/resize"
import logger from '@/lib/pino'
import { usePathname } from 'next/navigation'
import { HeaderLog } from "./header"

const HeaderMenuLog = HeaderLog.child({ path: 'NavbarMenu', component: 'Menu' })

const CustomNavbarMenu = memo(function NavBarMenu(props: {
    lessThanXs: boolean
}) {
    const pathname = usePathname()
    HeaderMenuLog.debug({ message: 'render NavBarMenu', pathname, props })
    const lessThanXs = props.lessThanXs
    const [isClient, setIsClient] = React.useState(false)

    React.useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient)
        return <ListMenuItems pathname={pathname} />
    return lessThanXs ? <ListMenuItems pathname={pathname} />
        : <ContentMenuItems pathname={pathname} />
})

const ListMenuItems = (props: any) => {
    return (
        <NavbarMenu className='flex flex-col gap-4'>
            {SiteLinks.map((item) => {
                return (
                    <NavbarMenuItem
                        isActive={item.link === props.pathname}
                        key={item.text + '-menu-item'}
                        className={`flex nowrap items-center text-default-900`}
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
        <NavbarContent className={`flex gap-4`} justify="center" >
            {SiteLinks.map((item) => {
                return (
                    <NavbarItem
                        isActive={item.link === props.pathname}
                        key={item.text + '-menu-item'}
                        className={`flex nowrap items-center text-default-900`}
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
            className='ml-2 text-inherit nav-link transition-colors'
            href={props.item.link}
            isExternal={props.item.isExternal}
        >
            {props.item.icon}
            < div
                className={`${props.item.link === props.pathname ? '' : 'block xs:hidden sm:inline'} ml-2 sm:flex`
                }
            >
                {props.item.text}
            </div>
        </Link >
    )
}

export default CustomNavbarMenu
