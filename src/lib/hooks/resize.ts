'use client'
import { useEffect, useRef, useState } from "react"
import { EXTRA_SMALL } from "../constants"
import logger from "../pino"

const WindowResizeLog = logger.child({ module: "WindowResize" })

const useWindowResizeThreshold = (threshold: number) => {
    const [isThresholdSize, setIsThresholdSize] = useState(true)
    const prevWidth = useRef(0)
    const [isMounted, setIsMounted] = useState(false)
    WindowResizeLog.debug({ message: 'hook called', threshold, isThresholdSize, isMounted })

    useEffect(() => {
        if (!isMounted) {
            WindowResizeLog.debug({ message: 'mounted' })
            setIsMounted(true)
            prevWidth.current = window.innerWidth
            setIsThresholdSize(prevWidth.current <= threshold)
        }
        const handleResize = () => {
            const currWidth = window.innerWidth
            WindowResizeLog.debug({ message: 'resize event', currWidth, prevWidth: prevWidth.current, threshold, isThresholdSize })
            if (currWidth <= threshold && prevWidth.current > threshold) {
                WindowResizeLog.debug({ message: 'resized to below threshold', currWidth, prevWidth: prevWidth.current, threshold, isThresholdSize })
                setIsThresholdSize(true)
            } else if (currWidth > threshold && prevWidth.current <= threshold) {
                WindowResizeLog.debug({ message: 'resized to above threshold', currWidth, prevWidth: prevWidth.current, threshold, isThresholdSize })
                setIsThresholdSize(false)
            }
            prevWidth.current = currWidth
        }

        if (window !== undefined) {
            window.addEventListener("resize", handleResize)
            return () => window.removeEventListener("resize", handleResize)
        }
    }, [threshold, isMounted])

    return isThresholdSize
}

export const useIsLessThanXS = () => useWindowResizeThreshold(EXTRA_SMALL)

