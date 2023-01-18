import { useState } from 'react'

export default function Mint () {
  const [audio, setAudio] = useState(null)
  const [uploaded, setUploaded] = useState(null)
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  const updateAudioFile = event => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]
      setAudio(i)
      setSubmitButtonDisabled(false)
    }
  }

  const uploadToPinata = async uploadUrl => {
    return fetch(
      '/api/upload?' +
        new URLSearchParams({
          url: uploadUrl,
          name: audio.name
        }),
      {
        method: 'POST'
      }
    ).then(response => {
      return response.json()
    })
  }

  const uploadTmp = async () => {
    //TODO treat exception when tmpfiles api not working

    const body = new FormData()
    body.append('file', audio)
    var res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body
    })
    var json = await res.json()
    var url = json['data']['url'] // tmpfiles upload URL
    var pathname = new URL(url).pathname
    var dlUrl = 'https://tmpfiles.org/dl' + pathname // tmpfiles download URL - has an extra /dl/ in the middle
    return dlUrl
    var res = await uploadToPinata(dlUrl)

  }

  const mintNFT = async () => {
    var tempUrl = await uploadTmp()
    var resPinata = await uploadToPinata(tempUrl)

    //TODO mint NFT

    setUploaded(resPinata.ipfsHash)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        height: '70vh',
        gap: '30px',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input
          className='block text-lg text-white border border-gray-300 rounded-lg cursor-pointer bg-teal-600  focus:outline-none'
          id='file_input'
          type='file'
          name='audioFile'
          accept='audio/mpeg'
          onChange={updateAudioFile}
          style={{}}
        ></input>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          style={{
            width: 'fit-content'
          }}
          className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
          type='submit'
          onClick={mintNFT}
          disabled={submitButtonDisabled}
        >
          Mint NFT
        </button>
      </div>
      {uploaded && <p>Minted NFT! IPFS hash: {uploaded}</p>}
    </div>
  )
}
