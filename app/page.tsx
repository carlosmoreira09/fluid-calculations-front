import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">
        Welcome to Oil and Gas Fluid Calculations
      </h1>
      <nav className="space-x-4">
        <Link 
          href="#"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Drilling Fluids
        </Link>
        <Link 
          href="/blog" 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
            Cementing Fluids
        </Link>
      </nav>
    </main>
  )
}

