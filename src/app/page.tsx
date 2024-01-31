import BioComponent from './components/bio'

export const metadata = {
    title: {
        absolute: 'Portfolio | Chris Billingham',
    },
    description: 'Christopher Billingham\'s portfolio website. Built with Next.JS and Tailwind CSS.',
}

export default function Home() {

    return (
        <div className="relative px-4 sm:px-24 top-4 left-0 h-fit min-w-fit w-screen flex-1 flex-col items-center justify-between">
            <BioComponent />
        </div>
    )
}
