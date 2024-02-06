'use client'

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import logger from '@/lib/pino'
import useScrollPosition from '@/lib/hooks/scroll-position'
import { useSwipeable } from "react-swipeable"

const SwipeableLayerLog = logger.child({ module: 'SwipeableLayer' })


const SWIPE_THRESHOLD = 50


const Pages: Array<string> = [
    "/",
    "/about",
    "/projects",
]

type AnimateString =
    'animate-slideOutLeft'
    | 'animate-slideOutRight'
    | 'animate-slideInLeft'
    | 'animate-slideInRight'
    | ''
const SwipeableLayer = (props: { children: React.ReactNode, className?: string }) => {
    const pathname = usePathname()
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').toString()
    const { addToScroll, overScroll, resetOverScroll } = useScrollPosition()
    const [animate, setAnimate] = useState(false)
    const [animateString, setAnimateString] = useState('' as AnimateString)
    const [elemPos, setElemPos] = useState({ x: 0, y: 0 })
    const swipedRenderAnimation = useRef<AnimateString>('')


    const LeftPage = Pages.at((Pages.indexOf(pathname) - 1))
    const RightPage = Pages[(Pages.indexOf(pathname) + 1) % Pages.length]

    if (!LeftPage || !RightPage) throw new Error('Bad Left/Right page pathnames')
    const delayedRouterPushLeft = useDelayedRouterPush(
        LeftPage,
    )
    const delayedRouterPushRight = useDelayedRouterPush(
        RightPage,
    )

    const resetSwipeState = () => {
        SwipeableLayerLog.debug({
            message: 'resetSwipeState',
            animate,

        })
        setAnimate(true)
        setAnimateString(swipedRenderAnimation.current)
        setElemPos({ x: 0, y: 0 })
        resetOverScroll()
    }

    const swipeHandlers = useSwipeable({
        onSwipedLeft: (e) => {
            SwipeableLayerLog.debug({ message: 'user swiped left', e })
            if (e.deltaX < -SWIPE_THRESHOLD) {
                setAnimate(true)
                setAnimateString('animate-slideOutLeft')
            }
        },
        onSwipedRight: (e) => {
            SwipeableLayerLog.debug({ message: 'user swiped right', e })
            if (e.deltaX > SWIPE_THRESHOLD) {
                setAnimate(true)
                setAnimateString('animate-slideOutRight')
            }
            setAnimate(true)
            setAnimateString('animate-slideOutRight')
        },
        onSwiping: (e) => {
            SwipeableLayerLog.debug('onSwiping', e)
            setElemPos({ x: e.deltaX, y: 0 })
            addToScroll(-e.deltaY)
        },
        onSwiped: (e) => {
            SwipeableLayerLog.debug('onSwiped', e)
            if (e.deltaX > -SWIPE_THRESHOLD && e.deltaX < SWIPE_THRESHOLD) {
                setElemPos({ x: 0, y: 0 })
                setAnimate(false)
            }
        },
        delta: 10,
        preventScrollOnSwipe: false,
        trackTouch: true,
        trackMouse: false,
        swipeDuration: Infinity,
    })

    useEffect(() => {
        setElemPos({ x: overScroll * -1, y: 0 })
        if (overScroll <= -50) {
            setAnimate(true)
            setAnimateString('animate-slideOutRight')
        } else if (overScroll >= 50) {
            setAnimate(true)
            setAnimateString('animate-slideOutLeft')
        }
    }, [overScroll])

    useEffect(() => {
        if (animateString === 'animate-slideOutLeft') {
            SwipeableLayerLog.debug('Sliding To Left')
            delayedRouterPushRight.then(
                (fn) => fn()
            ).catch(onrejected => SwipeableLayerLog.error(onrejected)).finally(() => {
                swipedRenderAnimation.current = 'animate-slideInRight'
            })
        } else if (animateString === 'animate-slideOutRight') {
            SwipeableLayerLog.debug('Sliding To Right')
            delayedRouterPushLeft.then(
                (fn) => fn()
            ).catch(onrejected => SwipeableLayerLog.error(onrejected)).finally(() => {
                swipedRenderAnimation.current = 'animate-slideInLeft'
            })
        }
    }, [animateString])

    useEffect(() => {
        const url = `${pathname}${searchParams}`
        SwipeableLayerLog.debug('url: ' + url)

        resetSwipeState()
    }, [pathname, searchParams])

    return (
        <div
            className={props.className}
            id='draggable'
            {...swipeHandlers}
            style={{
                position: 'relative',
                left: elemPos.x,
                top: elemPos.y,
            }}
        >
            <div className={'top-0 left-0 w-full flex justify-center items-center transition-all duration-300 ' + (animate ? animateString : '')}>
                {props.children}
            </div>
        </div>
    )
}

async function useDelayedRouterPush(href: string): Promise<() => void> {
    const router = useRouter()
    useEffect(() => {
        router.prefetch(href)
    })
    return new Promise(
        resolve => {
            setTimeout(() => {
                resolve(() => {
                    SwipeableLayerLog.debug('router replace href: ' + href)
                    router.replace(href)
                })
            }, 500)
        })
}

export default SwipeableLayer
