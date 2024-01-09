import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import Footer from './components/footer'
import NextHeader from './components/header'
import GoogleAnalytics from './google-analytics'

const font = Lato({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
    generator: 'Next.JS',
    authors: { name: 'Christopher Billingham' },
    creator: 'Christopher Billingham',
    publisher: 'Christopher Billingham',
    robots: 'all',
    keywords: 'portfolio, website, web development, software engineering, react, next.js, tailwind css, chris billingham, christopher billingham, tailwind, full stack, full stack engineer, web developer, developer',
    colorScheme: 'dark light',
    title: {
        template: '%s | Chris Billingham',
        default: 'Chris Billingham',
    },
    description: 'Chris Billingham\'s portfolio website. Built with Next.JS and Tailwind CSS.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className='w-screen h-fit overflow-scroll min-w-[350px]' suppressHydrationWarning>
            <body>
                {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
                    <GoogleAnalytics ga_id=
                        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
                ) : null}
                <Providers className='h-fit'>
                    <NextHeader />
                    <main className={font.className + ' box-border bg-default-200 dark:bg-default-800 transition-colors'}>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
