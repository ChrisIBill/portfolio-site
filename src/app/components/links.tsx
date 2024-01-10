import { IoConstruct, IoHome, IoInformationCircleSharp, IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

export interface SiteLinkType {
    icon: React.ReactNode,
    link: string,
    text: string,
    label: string
    isExternal?: boolean
}
export const SiteLinks = [
    {
        icon: <IoHome className='h-full text-default-900 self-center' />,
        link: '/',
        text: 'Home',
        label: 'Link to my Home page'
    },
    {
        icon: <IoInformationCircleSharp className='h-full text-default-900  self-center' />,
        link: '/about',
        text: 'About',
        label: 'Link to my About page'
    },
    {
        icon: <IoConstruct className='h-full text-default-900 self-center' />,
        link: '/projects',
        text: 'Projects',
        label: 'Link to my Projects page'
    },
    {
        icon: <IoLogoLinkedin className='h-full text-default-900 self-center' />,
        link: 'https://www.linkedin.com/in/chris-billingham-7781a1180/',
        text: 'LinkedIn',
        label: 'Link to my LinkedIn',
        isExternal: true,
    },
    {
        icon: <IoLogoGithub className='h-full text-default-900 self-center' />,
        link: 'https://www.github.com/ChrisIBill',
        text: 'Github',
        label: 'Link to my Github',
        isExternal: true,
    },
] as const
