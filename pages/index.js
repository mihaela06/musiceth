import { useAddress } from '@thirdweb-dev/react';
import Head from 'next/head'
import Login from "../components/Login";
import CreatePage from "../components/CreatePage";

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
          {address && <CreatePage />}
        </div>
      </main>
    </div>
  )
}
