'use client'
import { RefObject, useEffect, useRef, useState } from "react"
import logger from "../pino"

const ScrollPositionLog = logger.child({ module: 'scroll-position' })

export default function useScrollPosition() {
    const rootRef = useRef < HTMLElement | null > (null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollToRef = useRef < number | null > (null)
    const maxScrollPosition = getMaxScrollPosition(rootRef)

    async function addToScroll(amount: number) {
        ScrollPositionLog.debug({ message: 'addToScroll', scrollTo: scrollToRef.current, amount, scrollPosition, maxScrollPosition })
        if (scrollToRef.current === null) scrollToRef.current = scrollPosition + amount
        else scrollToRef.current += amount

        scrollToRef.current = Math.min(scrollToRef.current, maxScrollPosition || 0)
        scrollToRef.current = Math.max(scrollToRef.current, 0)
        rootRef.current?.scrollTo({ top: scrollToRef.current, behavior: 'smooth' })
        setScrollPosition(scrollToRef.current)
    }

    useEffect(() => {
        if (!window) return
        if (!rootRef.current) rootRef.current = document.getElementById('root')
        const handleScroll = () => {
            setScrollPosition(rootRef.current?.scrollTop || 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [rootRef])

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
