import Footer from "../components/footer"

/* eslint-disable react/no-unescaped-entities */
export default function Home() {
    return (
        <div className="box-border px-4 sm:px-24 min-h-[30rem] sm:min-h-[30rem] min-w-[350px]
            min-h-fit h-screen w-screen flex flex-1 flex-col items-center justify-around">
            {/* <div className="pt-24 pb-12 px-4 sm:px-24 min-h-[22rem] sm:min-h-[22rem] h-screen min-w-350 w-screen  */}
            {/*     flex flex-col left-0 items-center"> */}
            <AboutSection />
        </div >
    )
}

const AboutTextWrapper: React.FC<{ children: React.ReactNode }> = (props) => {
    return (
        <div className="text-foreground-900 self-center text-center whitespace-normal">
            {props.children}
        </div>
    )
}

const AboutSection = () => {
    return (
        <div className="flex flex-col min-h-fit w-full items-center justify-center transition-tranform">
            <div className="flex flex-col justify-center w-full">
                <AboutTextWrapper>
                    I'm a Software Engineer and Web Developer with a passion for building performant applications and expanding my knowledge of the field.
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
}
