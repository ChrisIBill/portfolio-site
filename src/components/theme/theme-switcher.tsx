'use client'
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "@theme-toggles/react/css/Classic.css"

import { Classic } from "@theme-toggles/react";
import logger from "@/lib/pino";

type ThemeType = "dark" | "light"
const ThemeLogger = logger.child({ module: 'Theme' })
const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    const handleThemeChange = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        ThemeLogger.info('theme changed: ' + newTheme)
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark')
    }

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark')
            document.documentElement.classList.add('dark')
        } else {
            setTheme('light')
            document.documentElement.classList.remove('dark')
        }
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }
    return (
        <div
            className='text-3xl w-4 mx-4 mt-2 text-foreground'
        >
            <Classic duration={750} placeholder={<></>} toggled={theme === "dark"} onToggle={handleThemeChange} forceMotion />
        </div>
    )
};


export default ThemeSwitcher;
