import { useEffect, useRef, useState } from "react"
import { EXTRA_SMALL } from "../constants"

const useWindowResizeThreshold = (threshold: number) => {
    const [isThresholdSize, setIsThresholdSize] = useState(true)
    const prevWidth = useRef(0)

    useEffect(() => {
        const handleResize = () => {
            const currWidth = window.innerWidth
            if (currWidth <= threshold && prevWidth.current > threshold) {
                setIsThresholdSize(true)
            } else if (currWidth > threshold && prevWidth.current <= threshold) {
                setIsThresholdSize(false)
            }
            prevWidth.current = currWidth
        }

        if (window !== undefined) {
            window.addEventListener("resize", handleResize)
            return () => window.removeEventListener("resize", handleResize)
        }
    }, [threshold])

    return isThresholdSize
}

export const useIsLessThanXS = () => useWindowResizeThreshold(EXTRA_SMALL)

