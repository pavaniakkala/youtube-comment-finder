import React from 'react'

function Footer() {
  return (
    <footer className="w-100">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-black-500">
            © 2024 YouTube Comment Finder. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <button className="text-black-400 hover:text-black-500">
              Privacy Policy
            </button>
            <button className="text-black-400 hover:text-black-500">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer