import AudioCard from '../components/AudioCard'
import { useState, useEffect } from 'react'
import { useAddress } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { contractAddress, contractABI } from '../contracts/exports'

export default function Home () {
  const userAddress = useAddress()
  const [NFTs, setNFTs] = useState([])

  console.log(userAddress)

  const getNFTs = async () => {
    if (userAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const NFTsContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )

      try {
        const NFTsURIs = await NFTsContract.getOnSaleNFTs()

        var newNFTs = []
        for (let i = 0; i < NFTsURIs[0].length; i++)
          newNFTs.push({ data: NFTsURIs[0][i], uri: NFTsURIs[1][i] })

        console.log('Retrieved NFTs...', newNFTs)
        setNFTs(newNFTs)
      } catch (error) {
        alert(error)
        console.log(error)
      }
    }
  }

  const removeItem = tokenId => {
    setNFTs(NFTs.filter((o, i) => tokenId !== o.data.tokenId.toString()))
  }

  useEffect(() => {
    getNFTs()
  }, [userAddress])

  return (
    <div className='flex flex-wrap justify-center'>
      {NFTs.map(nft => (
        <AudioCard
          key={nft.data.tokenId.toString()}
          ipfsHash={nft.uri}
          owned={false}
          tokenId={nft.data.tokenId.toString()}
          price={nft.data.price.toString()}
          minter={nft.data.artist}
          removeSelf={removeItem}
        />
      ))}
      {NFTs.length == 0 && (
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            height: '70vh',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <p className='font-bold text-xl text-center'>Nothing here yet...</p>
            <div
              style={{
                display: 'flex',
                margin: '20px',
                justifyContent: 'center'
              }}
            >
              <img
                width={'200px'}
                src='https://cdn.dribbble.com/users/860366/screenshots/6364054/desolazione_empty_1.gif'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
