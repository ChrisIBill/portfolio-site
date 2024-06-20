import {
  IoConstruct,
  IoHome,
  IoInformationCircleSharp,
  IoLogoGithub,
  IoLogoLinkedin,
} from "react-icons/io5";

export interface SiteLinkType {
  icon: React.ReactNode;
  link: string;
  text: string;
  label: string;
  isExternal: boolean;
}

export enum InternalLink {
  Home = "/home",
  About = "/about",
  Projects = "/projects",
}

export const InternalLinks = [
  InternalLink.Home,
  InternalLink.About,
  InternalLink.Projects,
] as const;
export type InternalLinkType = (typeof InternalLinks)[number];
export type InternalLinksType = typeof InternalLinks;
export const isInternalLink = (link: string): link is InternalLinkType =>
  InternalLinks.includes(link as InternalLinkType);
export const ExternalLinks = [
  "https://www.linkedin.com/in/christopher-billingham/",
  "https://www.github.com/ChrisIBill",
] as const;
export type ExternalLinkType = (typeof ExternalLinks)[number];
export const AllLinks = [...InternalLinks, ...ExternalLinks] as const;
export type AllLinkType = (typeof AllLinks)[number];

export const SiteLinks = [
  {
    icon: <IoHome className="h-full text-inherit self-center" />,
    link: InternalLink.Home,
    text: "Home",
    label: "Link to my Home page",
    isExternal: false,
  },
  {
    icon: (
      <IoInformationCircleSharp className="h-full text-inherit self-center" />
    ),
    link: InternalLink.About,
    text: "About",
    label: "Link to my About page",
    isExternal: false,
  },
  {
    icon: <IoConstruct className="h-full text-inherit self-center" />,
    link: InternalLink.Projects,
    text: "Projects",
    label: "Link to my Projects page",
    isExternal: false,
  },
  {
    icon: <IoLogoLinkedin className="h-full text-inherit self-center" />,
    link: "https://www.linkedin.com/in/christopher-billingham/",
    text: "LinkedIn",
    label: "Link to my LinkedIn",
    isExternal: true,
  },
  {
    icon: <IoLogoGithub className="h-full text-inherit self-center" />,
    link: "https://www.github.com/ChrisIBill",
    text: "Github",
    label: "Link to my Github",
    isExternal: true,
  },
] as const;
