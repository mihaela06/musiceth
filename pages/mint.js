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
    var res = await uploadToPinata(dlUrl)

    setUploaded(res.ipfsHash)
  }

  return (
    <div>
      <input
        type='file'
        name='audioFile'
        accept='audio/mpeg'
        onChange={updateAudioFile}
      />
      <button type='submit' onClick={uploadTmp} disabled={submitButtonDisabled}>
        Send to server
      </button>
      {uploaded && <p>{uploaded}</p>}
    </div>
  )
}
