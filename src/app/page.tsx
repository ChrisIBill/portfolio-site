import ThemeSwitcher from './components/theme/theme-switcher'
import BioComponent from './components/bio'
import MainMenu from './components/main-menu'

export default function Home() {
    return (
        <div className="bg-default-200 dark:bg-default-600 flex min-h-screen min-w-screen flex-col items-center justify-between transition-colors">
            <div className='w-full h-fit flex flex-col flex-1 items justify-center'>
                <BioComponent />
                <MainMenu />
            </div>
        </div>
    )
}
