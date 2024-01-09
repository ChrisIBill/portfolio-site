import { nextui } from '@nextui-org/react'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'


const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            'xs': '350px',
            ...defaultTheme.screens,
        },
        extend: {
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-150%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(150%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(0)' },
                    '100%': { transform: 'scale(1)' },
                }
            },
            animation: {
                fadeIn: 'fadeIn 1s ease-in-out',
                slideInLeft: 'slideInLeft 1s ease-in-out',
                slideInRight: 'slideInRight 1s ease-in-out',
                wiggle: 'wiggle 1s ease-in-out infinite',
                scaleUp: 'scaleUp 1s ease-in-out',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    darkMode: 'class',
    plugins: [nextui({
        addCommonColors: true,
    })],
}
export default config
