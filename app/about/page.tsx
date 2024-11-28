import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">About Us</h1>
        <p className="text-gray-600 mb-6">
          We are a team dedicated to creating amazing web experiences using Next.js and Tailwind CSS.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

