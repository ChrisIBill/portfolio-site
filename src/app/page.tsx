import ThemeSwitcher from '@/lib/theme-switcher'
import BioComponent from './components/bio'

export default function Home() {
    return (
        <main className="bg-default-300 flex min-h-screen flex-col items-center justify-between p-24 ">
            <ThemeSwitcher />
            <BioComponent />
        </main>
    )
}
