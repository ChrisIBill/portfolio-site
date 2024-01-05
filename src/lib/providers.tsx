'use client'

import RootStyleRegistry from './emotion';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation'
import { IconContext } from 'react-icons';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push}>
            <ThemeProvider defaultTheme='dark'>
                <IconContext.Provider value={{ color: 'blue', className: 'text-black' }}>
                    <RootStyleRegistry>
                        {children}
                    </RootStyleRegistry>
                </IconContext.Provider>
            </ThemeProvider>
        </NextUIProvider>
    )
}
