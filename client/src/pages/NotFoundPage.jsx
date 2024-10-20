import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, Home, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const codeSnippet = `
function findPage() {
  if (page === '404') {
    return 'Page Not Found';
  }
  return 'Keep Searching';
}
  `.trim()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 200 }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-200 dark:border-gray-800">
        <Link className="flex items-center justify-center" to="/">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">CodeCollab</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        {mounted && (
          <motion.div
            className="text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl font-bold text-gray-900 dark:text-gray-100"
              variants={childVariants}
            >
              404 - Page Not Found
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400"
              variants={childVariants}
            >
              Oops! It seems the code for this page is missing.
            </motion.p>
            <motion.div variants={childVariants}>
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-left overflow-x-auto">
                <code>{codeSnippet}</code>
              </pre>
            </motion.div>
            <motion.div variants={childVariants}>
              <Link to="/">
                <Button className="mt-4">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 CodeCollab. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="https://github.com/SSShogunn" target="_blank">
            <Github className="h-4 w-4" />
          </Link>
        </nav>
      </footer>
    </div>
  )
}