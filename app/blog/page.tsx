import Link from 'next/link'

export default function Blog() {
  const posts = [
    { id: 1, title: "Getting Started with Next.js" },
    { id: 2, title: "Mastering Tailwind CSS" },
    { id: 3, title: "The Power of React Hooks" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">Blog Posts</h1>
        <ul className="space-y-2 mb-6">
          {posts.map(post => (
            <li key={post.id} className="text-blue-600 hover:text-blue-800">
              <Link href={`/blog/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
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

