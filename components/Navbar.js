import Link from 'next/link'
import { useState } from 'react'

export const Navbar = () => {
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(!active)
  }

  return (
    <>
      <nav className='flex items-center flex-wrap bg-teal-600 p-3 '>
        <Link href='/' className='inline-flex items-center p-2 mr-4 '>
          <span className='text-3xl text-white font-bold font-mono tracking-wide'>
            musiceth
          </span>
        </Link>
        <button
          className=' inline-flex p-3 hover:bg-teal-700 rounded lg:hidden text-white ml-auto hover:text-white outline-none'
          onClick={handleClick}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={3}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
        <div
          className={`${
            active ? '' : 'hidden'
          }  w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto'>
            {[
              ['Mint an NFT', '/mint'],
              ['Your library', '/library']
            ].map(([title, url]) => (
              <Link
                href={url}
                key={url}
                className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-teal-700 hover:text-white '
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
