import Head from 'next/head'
import { useAddress } from '@thirdweb-dev/react'
import { Navbar } from './Navbar'
import Login from './Login'

export default function Layout ({ children, home }) {
  const address = useAddress()
  return (
    <div className='flex flex-col h-screen'>
      <Head>
        <title>musiceth</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Trade AudioNFTs' />
      </Head>

      <header className='sticky top-0'>
        <Navbar />
      </header>
      <main className='flex-1 overflow-y-scroll'>
        {address && children}
        {!address && <Login />}
      </main>
    </div>
  )
}
