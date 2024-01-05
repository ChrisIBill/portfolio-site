'use client'
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThemeToggleButtonIcon from "./theme";

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    const handleThemeChange = () => {
        console.log('theme changed: ' + theme)
        setTheme(theme === "dark" ? "light" : "dark")
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <button
            className="absolute top-0 left-0 p-4 postion-fixed"
            type="button"
            title="Toggle theme"
            aria-label="Toggle theme"
            onClick={handleThemeChange}
        >
            <ThemeToggleButtonIcon />
        </button>
    )
};
export default ThemeSwitcher;
