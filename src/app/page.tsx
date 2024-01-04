import ThemeSwitcher from '@/lib/theme-switcher'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <ThemeSwitcher />
            <div className="flex flex-col justify-center">
                <h1 className="text-lg my-3">
                    Christopher Billingham
                </h1>
                <span className="">
                    B.S. Computer Science, University of Texas at Dallas
                </span>
                <span className="">
                    Software Engineer, Web Developer
                </span>
            </div>
        </main>
    )
}
