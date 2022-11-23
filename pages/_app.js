import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

const activeChainId = ChainId.Sepolia;

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp