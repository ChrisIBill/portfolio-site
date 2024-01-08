import { Link } from '@nextui-org/react'

export async function getStaticProps(context) {
    return {
        notFound: true, // triggers 404
    };
}

export default function NotFound() {
    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center'>
            <h2 className='text-3xl m-4 text-default-900'>404: Page Not Found</h2>
            <Link href="/">Return Home</Link>
        </div>
    )
}
