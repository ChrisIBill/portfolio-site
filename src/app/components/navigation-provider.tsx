'use client'
import { NavigationContext, NavigationDirection } from "@/lib/navigation-context";
import { InternalLinkType, InternalLinks, isInternalLink } from "./links";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import logger from "@/lib/pino";

const NavigationProviderLog = logger.child({ module: 'NavigationProvider' })

export const ExitAnimationStrings = [
    'animate-slideOutLeft',
    'animate-slideOutRight',
    'animate-fadeOut',
] as const
export const EnterAnimationStrings = [
    'animate-slideInLeft',
    'animate-slideInRight',
    'animate-fadeIn',
] as const
const AnimationStrings = [
    ...EnterAnimationStrings,
    ...ExitAnimationStrings,
    '',
] as const
export type ExitAnimationStringType = typeof ExitAnimationStrings[number]
export type EnterAnimationStringType = typeof EnterAnimationStrings[number]
export type AnimationStringType = typeof AnimationStrings[number]

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [animateNavigation, setAnimateNavigation] = useState(false)
    const [animationString, setAnimationString] = useState<AnimationStringType>('')
    const [currentPage, setCurrentPage] = useState<InternalLinkType>(pathname as InternalLinkType)
    const requestedPage = useRef<InternalLinkType>('/')
    const [swipePosition, setSwipePosition] = useState(0)

    const asyncDelayRouterSwitch = useCallback(async (url: InternalLinkType, cb: () => void, delay = 500): Promise<void | (() => void)> => {
        NavigationProviderLog.debug({ message: 'asyncDelayRouterSwitch', url, delay })
        router.prefetch(url)
        return new Promise(
            resolve => {
                NavigationProviderLog.debug('asyncDelayFn resolved promise')
                return setTimeout(() => {
                    resolve(() => {
                        router.push(url)
                    })
                }, delay)
            },
        )
            .then(res => {
                NavigationProviderLog.debug({ message: 'asyncDelayFn then ', res })
                if (res instanceof Function)
                    res()
                else throw new Error('Invalid res', { cause: res })
                //cb()
            })
    }, [router])
    const pageRefs = useRef<{ [key: string]: InternalLinkType }>({
    })

    //Route Change Handlers
    const handleRouteChange = useCallback(async (direction?: NavigationDirection) => {
        NavigationProviderLog.debug({
            message: 'handleRouteChange',
            direction,
            requestedPage: requestedPage.current,
            pageRefs: pageRefs.current,
        })
        if (animateNavigation) {
            throw new Error('Navigation already animating', { cause: animateNavigation })
        }
        setAnimateNavigation(true)
        if (direction === 'next') {
            requestedPage.current = pageRefs.current.next
            setAnimationString('animate-slideOutLeft')
        }
        else if (direction === 'prev') {
            setAnimationString('animate-slideOutRight')
            requestedPage.current = pageRefs.current.prev
        }
    }, [animateNavigation])

    const handleRouteRequest = useCallback((route: string) => {
        NavigationProviderLog.debug({
            message: 'handleRouteChange',
            route,
            requestedPage: requestedPage.current,
            pageRefs: pageRefs.current,
        })
        setAnimateNavigation(true)
        if (!isInternalLink(route)) throw new Error('Invalid route', { cause: route })
        if (route === pageRefs.current.next) setAnimationString('animate-slideOutLeft')
        else if (route === pageRefs.current.prev) setAnimationString('animate-slideOutRight')
        else setAnimationString('animate-fadeOut')
        requestedPage.current = route
    }, [])

    useEffect(() => {
        NavigationProviderLog.debug({
            message: 'animating navigation',
            animationString,
            requestedPage: requestedPage.current,
        })

        async function animate() {
            switch (animationString) {
                case 'animate-slideOutLeft':
                    await asyncDelayRouterSwitch(requestedPage.current, () => setAnimationString('animate-slideInRight'), 500)
                    NavigationProviderLog.debug('animate-slideOutLeft')
                    break
                case 'animate-slideOutRight':
                    asyncDelayRouterSwitch(requestedPage.current, () => setAnimationString('animate-slideInLeft'), 500)
                    NavigationProviderLog.debug('animate-slideOutRight')
                    break
                case 'animate-fadeOut':
                    asyncDelayRouterSwitch(requestedPage.current, () => setAnimationString('animate-fadeIn'), 500)
                    break
                default:
                    NavigationProviderLog.debug('default case')
                    break
            }
        }
        animate()
    }, [animationString, asyncDelayRouterSwitch])
    useEffect(() => {
        NavigationProviderLog.debug({
            message: 'setting current page',
            pathname,
        })
        if (!isInternalLink(pathname)) throw new Error('Invalid pathname', { cause: pathname })
        NavigationProviderLog.debug({
            message: 'setting current page',
            pathname,
        })
        setCurrentPage(pathname)
        if (pathname === pageRefs.current.next) setAnimationString('animate-slideInRight')
        else if (pathname === pageRefs.current.prev) setAnimationString('animate-slideInLeft')
        else setAnimationString('animate-fadeIn')
        requestedPage.current = pathname
        pageRefs.current = {
            prev: InternalLinks[(InternalLinks.indexOf(pathname) + 1) % InternalLinks.length],
            next: InternalLinks.at((InternalLinks.indexOf(pathname) - 1)) as InternalLinkType,
        }
    }, [pathname])

    return (
        <NavigationContext.Provider value={{
            animateNavigation,
            setAnimateNavigation,
            animationString,
            setAnimationString,
            currentPage: currentPage,
            setCurrentPage: setCurrentPage,
            handleRouteChange,
            handleRouteRequest,
            swipePosition,
            setSwipePosition,
        }}>
            {children}
        </ NavigationContext.Provider>
    )
}
// async function asyncDelayRouterSwitch(router, url: InternalLinkType, delay = 500) {
//     NavigationProviderLog.debug({ message: 'asyncDelayRouterSwitch', url, delay })
//     router.prefetch(url)
//     return new Promise(
//         resolve => {
//             NavigationProviderLog.debug('asyncDelayFn resolved promise')
//             return setTimeout(() => {
//                 resolve(() => {
//                     router.push(url)
//                 })
//             }, delay)
//         },
//     )
// }
