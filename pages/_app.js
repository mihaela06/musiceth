import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import Layout from '../components/Layout'
import '../styles/main.css'

const activeChainId = ChainId.Sepolia

function MyApp ({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  )
}

export default MyApp
