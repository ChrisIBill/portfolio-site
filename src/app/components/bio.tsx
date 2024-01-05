const BioComponent: React.FC = () => {
    return (
        <div className="flex flex-col justify-center translate-x-full transition">
            <h1 className="text-lg my-3 text-foreground-900">
                Christopher Billingham
            </h1>
            <span className="text-foreground-600">
                B.S. Computer Science, University of Texas at Dallas
            </span>
            <span className="text-foreground-600">
                Software Engineer, Web Developer
            </span>
        </div>
    )
}

export default BioComponent
