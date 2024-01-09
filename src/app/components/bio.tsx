const BioComponent: React.FC = () => {
    return (
        <div className="relative flex flex-col w-full min-h-full items-center justify-center transition-transform animate-slideInLeft">
            <div className="relative bottom-8 flex flex-col w-fit justify-center">
                <h1 className="text-3xl my-3 text-foreground-900 self-center">
                    Christopher Billingham
                </h1>
                <span className="italic text-foreground-600">
                    B.S. Computer Science, University of Texas at Dallas
                </span>
                <span className="italic text-foreground-600">
                    Software Engineer, Web Developer
                </span>
                <hr className="bg-gradient-to-r from-default-900/0 via-default-900 to-default-900/0 w-7/8 my-3 border-0 h-px" />
            </div>
        </div>
    )
}

export default BioComponent
