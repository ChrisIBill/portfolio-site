import ThemeSwitcher from './components/theme/theme-switcher'
import BioComponent from './components/bio'
import MainMenu from './components/main-menu'

export const metadata = {
    title: {
        absolute: 'Portfolio | Chris Billingham',
    },
    description: 'Christopher Billingham\'s portfolio website. Built with Next.JS and Tailwind CSS.',
}

export default function Home() {
    return (
        <div className="pt-20 pb-12 px-4 sm:px-24 min-h-[15rem] top-0 left-0 min-h-fit h-screen min-w-fit w-screen flex-1 flex-col items-center justify-between">
            <BioComponent />
        </div>
    )
}
