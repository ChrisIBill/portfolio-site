'use client'

import RootStyleRegistry from './emotion';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation'
import { IconContext } from 'react-icons';
import { NavigationContext } from './navigation-context';
import { useState } from 'react';
import { InternalLinkType, InternalLinks, InternalLinksType } from '@/app/components/links';
import { NavigationProvider } from '@/app/components/navigation-provider';

export function Providers({ children, className }: { children: React.ReactNode, className: string }) {
    const router = useRouter();

    return (
        <NextUIProvider className={className} navigate={router.push}>
            <ThemeProvider defaultTheme='dark'>
                <IconContext.Provider value={{ className: 'text-black' }}>
                    <RootStyleRegistry>
                        <NavigationProvider>
                            {children}
                        </NavigationProvider>
                    </RootStyleRegistry>
                </IconContext.Provider>
            </ThemeProvider>
        </NextUIProvider>
    )
}
