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
            className="text-2xl w-4 mx-4 mt-2"
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
