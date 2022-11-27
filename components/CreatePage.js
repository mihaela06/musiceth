import { useAddress } from '@thirdweb-dev/react';
import { useState } from "react";

import AudioCard from './AudioCard';

const CreatePage = () => {
  const [audio, setAudio] = useState(null);
  const [audioCardList, setAudioCardList] = useState(null);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

  const address = useAddress();

  const updateAudioFile = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setAudio(i);
      setSubmitButtonDisabled(false);
    }
  };

  const uploadToPinata = async (uploadUrl) => {
    return fetch("/api/upload?" + new URLSearchParams({
      url: uploadUrl,
      name: audio.name
    }), {
      method: "POST"
    }).then((response) => {
      return response.json();
    })
  }

  const uploadTmp = async () => {
    //TODO treat exception when tmpfiles api not working

    const body = new FormData();
    body.append("file", audio);
    var res = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body
    })
    var json = await res.json();
    var url = json["data"]["url"];  //tmpfiles upload URL
    var pathname = new URL(url).pathname;
    var dlUrl = "https://tmpfiles.org/dl" + pathname; //tmpfiles download URL - has an extra /dl/ in the middle
    var res = await uploadToPinata(dlUrl);

    //TODO audio list will be loaded from blockchain in another page, hardcoded for now

    var audioList = new Array();
    audioList.push(res.ipfsHash);
    setAudioCardList(audioList);
  }

  return (
    <div>
      <h2>You are signed in as {address}</h2>
      <input type="file" name="audioFile" accept="audio/mpeg" onChange={updateAudioFile} />
      <button
        type="submit"
        onClick={uploadTmp}
        disabled={submitButtonDisabled}
      >
        Send to server
      </button>
      {audioCardList && audioCardList.map(ipfsHash => (
        <div key={ipfsHash}>
          <AudioCard ipfsHash={ipfsHash} />
        </div>
      ))}
    </div>
  );
};
export default CreatePage;