import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import Footer from './components/footer'
import NextHeader from './components/header'

const font = Lato({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Portfolio | Chris Billingham',
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
                <Providers className='h-fit'>
                    <NextHeader />
                    <main className={font.className + ' box-border bg-default-200 dark:bg-default-800 transition-colors'}>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
