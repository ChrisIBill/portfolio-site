'use client'
import { RefObject, useEffect, useRef, useState } from "react"
import logger from "../pino"

const ScrollPositionLog = logger.child({ module: 'scroll-position' })

export default function useScrollPosition() {
    const scrollRef = useRef < HTMLElement | null > (null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollToRef = useRef < number | null > (null)
    const maxScrollPosition = getMaxScrollPosition(scrollRef)

    async function addToScroll(amount: number) {
        if (!scrollRef.current) {
            ScrollPositionLog.error({ message: 'scrollRef.current not found' })
            return
        }
        if (scrollToRef.current === null) scrollToRef.current = scrollPosition + amount
        else scrollToRef.current += amount

        scrollToRef.current = Math.min(scrollToRef.current, maxScrollPosition || 0)
        scrollToRef.current = Math.max(scrollToRef.current, 0)
        ScrollPositionLog.debug({ message: 'addToScroll', scrollTo: scrollToRef.current, scrollRef: scrollRef.current })
        scrollRef.current?.scrollTo({ top: scrollToRef.current, behavior: 'auto' })
        setScrollPosition(scrollToRef.current)
    }

    useEffect(() => {
        if (!scrollRef.current) {
            scrollRef.current = document.getElementById('scrollable')
            if (!scrollRef.current) {
                ScrollPositionLog.error({ message: 'scrollRef.current not found' })
                return
            }
        }
        const handleScroll = () => {
            setScrollPosition(scrollRef.current?.scrollTop || 0)
        }
        scrollRef.current.addEventListener('scroll', handleScroll)
        return () => scrollRef.current?.removeEventListener('scroll', handleScroll)
    }, [scrollRef])

    return {
        scrollPosition,
        maxScrollPosition,
        addToScroll,
    }
}

export function getMaxScrollPosition(ref: RefObject<HTMLElement>) {
    if (!ref.current) return null
    else if (ref.current instanceof HTMLElement) return ref.current.scrollHeight - ref.current.clientHeight
    else return null
}
