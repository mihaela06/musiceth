import { useEffect, useState } from "react";

const AudioCard = (props) => {
    const loadingDisk = "/record.gif";
    const [imgSrc, setImgSrc] = useState(loadingDisk);
    const [imgSize, setImgSize] = useState(100);

    var ipfsHash = props.ipfsHash;

    const imageDivStyle = {
        borderStyle: "solid",
        borderColor: "grey",
        height: "200px",
        width: "200px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

    useEffect(() => {
        const getImage = async () => {
            try {
                var res = await fetch("/api/getImage?" + new URLSearchParams({
                    ipfsHash: ipfsHash
                }), {
                    method: "POST"
                });
                var json = await res.json();

                if (json.picUrl)
                    setImgSrc(json.picUrl);
                else
                    setImgSrc("/disk.png");

                setImgSize(200);
            }
            catch (e) {
                console.log(e);
                setImgSrc("/disk.png");
                setImgSize(200);
            }
        }

        if (imgSrc == loadingDisk)
            getImage();
    })

    return (<div>
        <p>{ipfsHash}</p>

        <div style={imageDivStyle}>
            <img src={imgSrc} width={imgSize} height={imgSize} />
        </div>
        <div>
            <audio controls>
                <source src={"https://gateway.pinata.cloud/ipfs/" + ipfsHash} type="audio/mpeg" />
            </audio>
        </div>
    </div>)
}

export default AudioCard;
