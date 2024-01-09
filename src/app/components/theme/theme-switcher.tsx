'use client'
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "@theme-toggles/react/css/Classic.css"

import { Classic } from "@theme-toggles/react";


const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const [toggled, setToggled] = useState(useTheme().theme === "dark")

    const handleThemeChange = () => {
        console.log('theme changed: ' + theme)
        setTheme(toggled ? "light" : "dark")
        setToggled(!toggled)
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div
            className='text-3xl w-4 mx-4 mt-2 text-foreground'
        >
            <Classic duration={750} placeholder={<></>} toggled={toggled} onToggle={handleThemeChange} forceMotion />
        </div>
    )
};


export default ThemeSwitcher;
