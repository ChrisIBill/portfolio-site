'use client'

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import logger from '@/lib/pino'
import useScrollPosition from '@/lib/hooks/scroll-position'
import { useSwipeable } from "react-swipeable"
import { useContext } from "react"
import { NavigationContext } from "@/lib/navigation-context"

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
    const { animateNavigation, setAnimateNavigation, animationString, handleRouteChange } = useContext(NavigationContext)
    const { addToScroll, overScroll, resetOverScroll } = useScrollPosition()
    const [elemPos, setElemPos] = useState({ x: 0, y: 0 })

    const resetSwipeState = () => {
        SwipeableLayerLog.debug({
            message: 'resetSwipeState',
        })
        setElemPos({ x: 0, y: 0 })
        resetOverScroll()
    }

    const swipeHandlers = useSwipeable({
        onSwipedLeft: (e) => {
            SwipeableLayerLog.debug({ message: 'user swiped left', e })
            if (e.deltaX < -SWIPE_THRESHOLD) {
                handleRouteChange('next')
            }
        },
        onSwipedRight: (e) => {
            SwipeableLayerLog.debug({ message: 'user swiped right', e })
            if (e.deltaX > SWIPE_THRESHOLD) {
                handleRouteChange('prev')
            }
        },
        onSwiping: (e) => {
            SwipeableLayerLog.debug({ message: 'onSwiping', deltaX: e.deltaX, deltaY: e.deltaY })
            if (Math.abs(e.deltaX) >= 15)
                setElemPos({ x: e.deltaX, y: 0 })
            addToScroll(-e.deltaY)
        },
        onSwiped: (e) => {
            SwipeableLayerLog.debug('onSwiped', e)
            if (e.deltaX > -SWIPE_THRESHOLD && e.deltaX < SWIPE_THRESHOLD) {
                setElemPos({ x: 0, y: 0 })
            }
        },
        delta: 10,
        preventScrollOnSwipe: false,
        trackTouch: true,
        trackMouse: false,
        swipeDuration: Infinity,
    })

    useEffect(() => {
        if (animateNavigation) return
        setElemPos({ x: overScroll, y: 0 })
        if (overScroll <= -50) {
            handleRouteChange('next')
        } else if (overScroll >= 50) {
            handleRouteChange('prev')
        }
    }, [overScroll])

    useEffect(() => {
        setElemPos({ x: 0, y: 0 })
    }, [pathname])

    return (
        <div className={
            'relative z-5 w-full overflow-visible flex-grow pt-16 top-0 left-0 flex justify-center items-center transition-all duration-300 '
            + (animateNavigation ? animationString : '')}
            onAnimationEnd={() => setAnimateNavigation(false)}
        >
            <div
                id='draggable'
                className='flex flex-col'
                {...swipeHandlers}
                style={{
                    position: 'relative',
                    left: elemPos.x,
                    top: elemPos.y,
                }}
            >

                {props.children}
            </div>
        </div>
    )
}

export function useSwipeableLayer() {
    const [animate, setAnimate] = useState(false)
    const [animateString, setAnimateString] = useState < AnimateString > ('')
    return {
        animate,
        setAnimate,
        animateString,
        setAnimateString
    }
}

export default SwipeableLayer
