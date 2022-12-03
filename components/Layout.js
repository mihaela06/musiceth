import Head from 'next/head'
import { Navbar } from './Navbar'

export default function Layout ({ children, home }) {
  return (
    <div>
      <Head>
        <title>musiceth</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Trade AudioNFTs' />
      </Head>

      <Navbar />
      <main>{children}</main>
    </div>
  )
}
