import { useAddress } from '@thirdweb-dev/react';
import Head from 'next/head'
import Login from "../components/Login";

export default function Home() {
  const address = useAddress();

  return (
    <div className="container">
      <Head>
        <title>musiceth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          {!address && <Login />}
          {address && <h2>You are signed in as {address}</h2>}
        </div>
      </main>
    </div>
  )
}
