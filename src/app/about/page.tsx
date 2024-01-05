/** @jsxImportSource @emotion/react */
'use client'
/* eslint-disable react/no-unescaped-entities */
export default function Home() {
    return (
        <div className="bg-default-200 dark:bg-default-600 flex min-h-screen min-w-screen flex-col items-center justify-around sm:px-28 px-4 transition-colors">
            <h2 className="text-3xl my-3 text-foreground-900 self-center py-12">
                About
            </h2>
            <div className='flex flex-col flex-1 justify-center'>
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
                    C#, JavaScript, TypeScript, HTML, CSS, SQL, and Python
                </AboutTextWrapper>
                <AboutTextWrapper>
                    Currently seeking full-time opportunities in the field and working on personal projects in my free time.
                </AboutTextWrapper>
            </div>
        </div >
    )
}

const AboutTextWrapper: React.FC<{ children: React.ReactNode }> = (props) => {
    return (
        <div className="text-foreground-900 self-center text-center">
            {props.children}
        </div>
    )
}
