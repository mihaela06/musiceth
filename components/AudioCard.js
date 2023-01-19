import { useEffect, useState, Fragment } from 'react'
import styles from '../styles/AudioCard.module.css'
import { useAddress } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { contractAddress, contractABI } from '../contracts/exports'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from '@material-tailwind/react'

const AudioCard = props => {
  const userAddress = useAddress()

  const loadingDisk = '/images/record.gif'
  const [imgSrc, setImgSrc] = useState(loadingDisk)
  const [imgSize, setImgSize] = useState(150)
  const [isHovering, setIsHovering] = useState(false)
  const [artist, setArtist] = useState('Unknown artist')
  const [title, setTitle] = useState('Untitled')
  const [owned, setOwned] = useState(false)

  const [openDialog, setOpenDialog] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)
  const [price, setPrice] = useState(undefined)

  const handleOpenDialog = () => setOpenDialog(!openDialog)
  const handleOpenInfo = () => setOpenInfo(!openInfo)

  var ipfsHash = props.ipfsHash

  const handleHoverBegin = () => {
    setIsHovering(true)
  }

  const handleHoverEnd = () => {
    setIsHovering(false)
  }

  const imageDivStyle = {
    height: '300px',
    width: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  useEffect(() => {
    const getImage = async () => {
      try {
        var res = await fetch(
          '/api/getAudioMetadata?' +
            new URLSearchParams({
              ipfsHash: ipfsHash
            }),
          {
            method: 'POST'
          }
        )
        var json = await res.json()

        if (json.artist) setArtist(json.artist)
        if (json.title) setTitle(json.title)

        if (json.picUrl) setImgSrc(json.picUrl)
        else setImgSrc('/images/disk.png')

        setImgSize(280)
      } catch (e) {
        console.log(e)
        setImgSrc('/images/disk.png')
        setImgSize(280)
      }
    }

    if (imgSrc == loadingDisk) {
      getImage()
    }
  })

  useEffect(() => {
    setOwned(props.owned)
  }, [props.owned])

  const sellNFT = async () => {
    if (userAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const NFTsContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )

      try {
        const tx = await NFTsContract.sellNFT(props.tokenId, price)
        console.log(tx)

        props.removeSelf(props.tokenId)
        setOwned(!owned)
      } catch (error) {
        alert(error)
        console.log(error)
      }
    }
  }

  const buyNFT = async () => {
    if (userAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const NFTsContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )

      console.log(props.tokenId, props.price)
      const options = {
        value: ethers.utils.formatUnits(props.price, 'wei'),
        gasLimit: 1000000
      }
      console.log(options)

      try {
        const tx = await NFTsContract.buyNFT(props.tokenId, options)
        console.log(tx)

        props.removeSelf(props.tokenId)
        setOwned(!owned)
      } catch (error) {
        alert(error)
        console.log(error)
      }

    }
  }

  return (
    <div className='bg-teal-600 rounded-3xl m-5 relative'>
      <div style={imageDivStyle} className='z-0'>
        <img
          src={imgSrc}
          width={imgSize}
          height={imgSize}
          className='rounded-3xl'
        />
      </div>
      <div>
        <audio controls className={styles.audio}>
          <source
            src={'https://gateway.pinata.cloud/ipfs/' + ipfsHash}
            type='audio/mpeg'
          />
        </audio>
      </div>
      <div
        className={styles.hoverButtonDiv}
        onMouseEnter={handleHoverBegin}
        onMouseLeave={handleHoverEnd}
      >
        {(isHovering || openDialog) && (
          <div className={styles.hoverButton}>
            <div style={{ display: 'flex', width: '100%' }}>
              <p
                style={{ width: '240px' }}
                className='text-xl p-3 font-bold bg-gray-100'
              >
                {artist}
              </p>
              <div
                className='cursor-pointer'
                style={{ alignSelf: 'center' }}
                onClick={handleOpenInfo}
              >
                <Fragment>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                    class='w-8 h-8 bg-white rounded-full z-10'
                  >
                    <path d='M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z' />
                  </svg>
                  <Dialog
                    open={openInfo}
                    handler={handleOpenInfo}
                    className='w-3/5 min-w-[60%] max-w-[80%]'
                  >
                    <DialogHeader>Track information</DialogHeader>
                    <DialogBody divider>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}
                      >
                        <p
                          className='text-black text-lg font-bold'
                          style={{
                            height: '50px',
                            padding: '10px'
                          }}
                        >
                          Token ID: {props.tokenId}
                        </p>
                        <p
                          className='text-black text-lg font-bold'
                          style={{
                            height: '50px',
                            padding: '10px'
                          }}
                        >
                          Price: {props.price}
                        </p>
                        <p
                          className='text-black text-lg font-bold'
                          style={{
                            height: '50px',
                            padding: '10px'
                          }}
                        >
                          IPFS hash: {props.ipfsHash}
                        </p>
                        <p
                          className='text-black text-lg font-bold'
                          style={{
                            height: '50px',
                            padding: '10px'
                          }}
                        >
                          Minter: {props.minter}
                        </p>
                      </div>
                    </DialogBody>
                    <DialogFooter>
                      <Button
                        variant='gradient'
                        color='green'
                        onClick={handleOpenInfo}
                      >
                        <span>OK</span>
                      </Button>
                    </DialogFooter>
                  </Dialog>
                </Fragment>
              </div>
            </div>
            <p className='text-xl px-3 font-bold bg-gray-100'>{title}</p>
            <div className={styles.centered}>
              {owned && (
                <div>
                  <Fragment>
                    <button
                      className='text-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl'
                      onClick={handleOpenDialog}
                    >
                      Sell
                    </button>
                    <Dialog
                      open={openDialog}
                      handler={handleOpenDialog}
                      className='w-2/5 min-w-[40%] max-w-[80%]'
                    >
                      <DialogHeader>Enter the selling price</DialogHeader>
                      <DialogBody divider>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'row'
                          }}
                        >
                          <input
                            type='number'
                            id='price'
                            min='1'
                            step='1'
                            className='border border-teal-700 text-black text-lg font-bold rounded-xl'
                            placeholder='Sale price'
                            required
                            onChange={e => setPrice(e.target.value)}
                            style={{
                              height: '50px',
                              padding: '0px 10px',
                              marginRight: '15px',
                              width: '120px'
                            }}
                          />
                          <p
                            className='text-black text-lg font-bold'
                            style={{
                              height: '50px',
                              padding: '10px'
                            }}
                          >
                            Wei
                          </p>
                        </div>
                      </DialogBody>
                      <DialogFooter>
                        <Button
                          variant='text'
                          color='red'
                          onClick={handleOpenDialog}
                          className='mr-1'
                        >
                          <span>Cancel</span>
                        </Button>
                        <Button
                          variant='gradient'
                          color='green'
                          onClick={sellNFT}
                          disabled={price ? false : true}
                        >
                          <span>Confirm</span>
                        </Button>
                      </DialogFooter>
                    </Dialog>
                  </Fragment>
                </div>
              )}
              {!owned && (
                <button
                  className='text-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl'
                  onClick={buyNFT}
                >
                  Buy
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioCard
