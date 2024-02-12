'use client'
import { RefObject, useEffect, useRef, useState } from "react"
import logger from "../pino"
import { debounce } from 'lodash'

const ScrollPositionLog = logger.child({ module: 'scroll-position' })

export default function useScrollPosition() {
    const scrollRef = useRef < HTMLElement | null > (null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollToRef = useRef < number | undefined > (undefined)
    const [overScroll, setOverScroll] = useState(0)
    const overScrollRef = useRef < number > (0)
    const maxScrollPosition = getMaxScrollPosition(scrollRef)

    async function addToScroll(amount: number) {
        if (!scrollRef.current) {
            ScrollPositionLog.error({ message: 'scrollRef.current not found' })
            return
        }
        if (!scrollToRef.current) scrollToRef.current = scrollPosition + amount
        else scrollToRef.current += amount

        scrollToRef.current = Math.max(Math.min(scrollToRef.current, maxScrollPosition || 0), 0)
        ScrollPositionLog.debug({ message: 'addToScroll', scrollTo, scrollToRef: scrollToRef.current, scrollRef: scrollRef.current })
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollToRef.current, behavior: 'smooth' }))
        setScrollPosition(scrollToRef.current)
    }
    const resetOverScroll = () => {
        overScrollRef.current = 0
        setOverScroll(0)
    }

    useEffect(() => {
        const resScroll = debounce(resetOverScroll, 300)

        if (!scrollRef.current) {
            scrollRef.current = document.getElementById('scrollable')
            if (!scrollRef.current) {
                ScrollPositionLog.error({ message: 'scrollRef.current not found' })
                return
            }
            ScrollPositionLog.debug({ message: 'scrollRef.current found', scrollRef: scrollRef.current })
        }
        const handleScroll = (e: Event) => {
            ScrollPositionLog.debug({ message: 'scrolling', scrollPos: scrollRef.current?.scrollTop || 0 })
            setScrollPosition(scrollRef.current?.scrollTop || 0)
        }
        const handleWheel = async (e: WheelEvent) => {
            if (scrollPosition <= 0 || scrollPosition >= (maxScrollPosition || 0)) {
                if (scrollPosition <= 0 && e.deltaY < 0) {
                    overScrollRef.current += -10
                    ScrollPositionLog.debug({ message: 'overScroll neg', overScroll: overScrollRef.current, scrollPosition, deltaY: e.deltaY })
                    setOverScroll(overScrollRef.current)
                    resScroll()
                } else if (scrollPosition >= (maxScrollPosition || 0) && e.deltaY > 0) {
                    overScrollRef.current += 10
                    ScrollPositionLog.debug({ message: 'overScroll pos', overScroll: overScrollRef.current, scrollPosition, deltaY: e.deltaY })
                    setOverScroll(overScrollRef.current)
                    resScroll()
                }
            } else {
                overScrollRef.current = 0
                setOverScroll(0)
            }
        }
        scrollRef.current.addEventListener('scroll', handleScroll)
        scrollRef.current.addEventListener('wheel', handleWheel)
        return () => {
            scrollRef.current?.removeEventListener('scroll', handleScroll)
            scrollRef.current?.removeEventListener('wheel', handleWheel)
        }
    }, [scrollRef, scrollPosition])

    return {
        addToScroll,
        overScroll,
        resetOverScroll,
    }
}

export function getMaxScrollPosition(ref: RefObject<HTMLElement>) {
    if (!ref.current) return null
    else if (ref.current instanceof HTMLElement) return ref.current.scrollHeight - ref.current.clientHeight
    else return null
}
