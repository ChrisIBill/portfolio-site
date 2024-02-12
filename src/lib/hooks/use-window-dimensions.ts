import { debounce } from "lodash"
import { useEffect, useState } from "react"

function getWindowDimensions() {
    if (typeof window !== 'undefined') {
        const { innerWidth: width, innerHeight: height } = window
        return {
            width,
            height,
        }
    } else {
        return {
            width: undefined,
            height: undefined,
        }
    }
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    )

    useEffect(() => {
        const handleResize = debounce(() => {
            setWindowDimensions(getWindowDimensions())
        }, 300)

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
}
