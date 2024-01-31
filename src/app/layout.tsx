import type { Metadata, Viewport } from 'next'
import { Lato } from 'next/font/google'
import './globals.scss'
import { Providers } from '@/lib/providers'
import Footer from './components/footer'
import NextHeader from './components/header'
import GoogleAnalytics from './google-analytics'
import SwipeableLayer from './components/swipeable-layer'

const font = Lato({ weight: '400', subsets: ['latin'] })

export const viewport: Viewport = {
    themeColor: 'dark'
}

export const metadata: Metadata = {
    generator: 'Next.JS',
    authors: { name: 'Christopher Billingham' },
    creator: 'Christopher Billingham',
    publisher: 'Christopher Billingham',
    robots: 'all',
    keywords: 'portfolio, website, web development, software engineering, react, next.js, tailwind css, chris billingham, christopher billingham, tailwind, full stack, full stack engineer, web developer, developer, javascript, typescript, .net, c-sharp, c#, vite, front end, front end developer',
    metadataBase: new URL('https://christopher-billingham.com'),
    alternates: {
        canonical: '/',
    },
    title: {
        template: '%s | Chris Billingham',
        default: 'Chris Billingham',
    },
    description: 'Software Engineer and Web Developer with a B.S. in Computer Science. Built with Next.JS.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className='w-screen min-h-screen h-fit overflow-y-scroll overflow-x-scroll xs:overflow-x-hidden bg-default-200 dark:bg-default-800 transition-colors duration-400' suppressHydrationWarning>
            <body className='bg-transparent'>
                {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
                    <GoogleAnalytics ga_id=
                        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
                ) : null}
                <Providers className='min-h-screen flex flex-col justify-between'>
                    <NextHeader />
                    <SwipeableLayer className='flex-grow flex h-full'>
                        <main className={font.className + ' box-border flex justify-center'}>{children}</main>
                    </SwipeableLayer>
                    <nav></nav>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
