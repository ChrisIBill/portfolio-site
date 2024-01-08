import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import Footer from './components/footer'
import Header from './components/header'

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
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <Header />
                    <main className={font.className + ' absolute top-0 w-screen'}>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
