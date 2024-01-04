'use client'
import ThemeToggleButtonIcon from "@/app/components/theme";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
            className="theme-toggle"
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