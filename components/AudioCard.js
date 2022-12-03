import { useEffect, useState } from 'react'
import styles from '../styles/AudioCard.module.css'

const AudioCard = props => {
  const loadingDisk = '/images/record.gif'
  const [imgSrc, setImgSrc] = useState(loadingDisk)
  const [imgSize, setImgSize] = useState(150)
  const [isHovering, setIsHovering] = useState(false)

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
          '/api/getImage?' +
            new URLSearchParams({
              ipfsHash: ipfsHash
            }),
          {
            method: 'POST'
          }
        )
        var json = await res.json()

        if (json.picUrl) setImgSrc(json.picUrl)
        else setImgSrc('/images/disk.png')

        setImgSize(280)
      } catch (e) {
        console.log(e)
        setImgSrc('/images/disk.png')
        setImgSize(280)
      }
    }

    if (imgSrc == loadingDisk) getImage()
  })

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
        {isHovering && (
          <div className={styles.hoverButton}>
            {/* TODO Get actual artist name and song title */}
            <p className='text-xl p-3'>Artist</p>
            <p className='text-xl px-3'>Song title</p>
            <div className={styles.centered}>
              <button className='text-2xl bg-gray-500 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl'>
                {/* TODO button will display a different option depending on NFT state (e.g. buy if for sale, sell if owned) */}
                Buy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioCard
