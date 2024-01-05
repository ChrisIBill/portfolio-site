import ThemeSwitcher from './components/theme/theme-switcher'
import BioComponent from './components/bio'
import MainMenu from './components/main-menu'

export default function Home() {
    return (
        <div className="bg-default-200 dark:bg-default-600 flex min-h-screen min-w-screen flex-col items-center justify-between p-24 transition-colors">
            <ThemeSwitcher />
            <div className='w-full h-fit flex flex-1 items justify-around'>
                <BioComponent />
                <MainMenu />
            </div>
        </div>
    )
}
