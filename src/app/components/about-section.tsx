import logger from "@/lib/pino"
import { memo } from "react"

const AboutSectionLog = logger.child({ module: 'AboutSection' })
const AboutTextWrapper: React.FC<{ children: React.ReactNode }> = (props) => {
    return (
        <div className="text-foreground-900 self-center text-center whitespace-normal">
            {props.children}
        </div>
    )
}

export const AboutSection = memo(function AboutSection() {
    console.debug('render about section')

    return (
        <div className="flex flex-col min-h-fit w-fit full items-center justify-center transition-transform drop-shadow-glow">
            <div className="flex flex-col justify-center w-full">
                <AboutTextWrapper>
                    I&apos;m a Software Engineer and Web Developer with a passion for building performant applications and expanding my knowledge of the field.
                </AboutTextWrapper>
                <AboutTextWrapper>
                    Graduated from UTD in May 2023 with a bachelors in Computer Science
                </AboutTextWrapper>
                <AboutTextWrapper>
                    Experienced in the React and .NET ecosystems.
                </AboutTextWrapper>
                <AboutTextWrapper>
                    With extensive knowledge of
                </AboutTextWrapper>
                <AboutTextWrapper>
                    C#, JavaScript, TypeScript, HTML, CSS, SQL, and Python.
                </AboutTextWrapper>
                <AboutTextWrapper>
                    Currently seeking full-time opportunities in the field and working on personal projects in my free time.
                </AboutTextWrapper>
            </div>
        </div>
    )
})
