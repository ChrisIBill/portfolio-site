'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Draggable, { DraggableData, DraggableEventHandler } from "react-draggable"
import logger from '@/lib/pino'
import useScrollPosition from "@/lib/hooks/scroll-position"

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
    const searchParams = useSearchParams()
    const { scrollPosition, maxScrollPosition, addToScroll } = useScrollPosition()
    const draggableRef = useRef(null)
    const [disabled, setDisabled] = useState(false)
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

    const mouseEventControl = async (e: React.MouseEvent, data: DraggableData) => {
        console.log('mouseEventControl', e, data)
        if (e.type === 'mousedown' || e.type === 'touchstart') {

        } else if (e.type === 'mouseup' || e.type === 'touchend') {
            SwipeableLayerLog.debug('mouseup')
        }
    }

    const handleDrag: DraggableEventHandler = (e, data: DraggableData) => {
        SwipeableLayerLog.debug({ message: 'handleDrag', deltaY: data.deltaY, scrollPosition, maxScrollPosition })
        addToScroll(-data.deltaY)
        setElemPos({ x: data.x, y: 0 })
    }

    const handleStop: DraggableEventHandler = (e, data: DraggableData) => {
        if (data.x > SWIPE_THRESHOLD) {
            SwipeableLayerLog.debug('user swiped right')
            setAnimate(true)
            setAnimateString('animate-slideOutRight')
        } else if (data.x < -SWIPE_THRESHOLD) {
            SwipeableLayerLog.debug('user swiped left')
            setAnimate(true)
            setAnimateString('animate-slideOutLeft')
        } else {
            SwipeableLayerLog.debug('user swiped partial, resetting')
            swipedRenderAnimation.current = ''
            setElemPos({ x: 0, y: 0 })
        }
    }

    useEffect(() => {
        if (animateString === 'animate-slideOutLeft') {
            delayedRouterPushRight.then(
                (fn) => fn()
            ).catch(onrejected => SwipeableLayerLog.error(onrejected)).finally(() => {
                swipedRenderAnimation.current = 'animate-slideInRight'
            })
        } else if (animateString === 'animate-slideOutRight') {
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
        const resetSwipeState = () => {
            SwipeableLayerLog.debug({
                message: 'resetSwipeState',
                animate,
                animateString,
                swipedRenderAnimation: swipedRenderAnimation.current,
            })
            setAnimate(true)
            setAnimateString(swipedRenderAnimation.current)
            setElemPos({ x: 0, y: 0 })
        }

        resetSwipeState()
    }, [pathname, searchParams])

    return (
        <Draggable
            axis='x'
            //bounds={{ left: -100, right: 100 }}
            onMouseDown={mouseEventControl}
            disabled={disabled}
            onDrag={handleDrag}
            onStop={handleStop}
            position={elemPos}
            nodeRef={draggableRef}
        >
            <div ref={draggableRef} className={props.className}>
                <div className={'top-0 left-0 w-full flex justify-center items-center transition-all duration-300 ' + (animate ? animateString : '')}>
                    {props.children}
                </div>
            </div>
        </Draggable>
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
