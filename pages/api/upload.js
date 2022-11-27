import pinataSDK from "@pinata/sdk";
const axios = require("axios");
const axiosRetry = require("axios-retry");

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

export default (req, res) => {
    try {
        const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

        const axiosInstance = axios.create();

        axiosRetry(axiosInstance, { retries: 5 });

        const { url, name } = req.query

        return axiosInstance(url, {
            method: "GET",
            responseType: "stream",
        }).then((response) => {
            pinata.pinFileToIPFS(response.data, {
                pinataMetadata: {
                    name: name
                },
                pinataOptions: {
                    cidVersion: 0,
                },
            }).then((response) => {
                //TODO treat case when isDuplicate = true, maybe display error with upload timestamp

                const ipfsHash = response.IpfsHash;

                res.json({ ipfsHash: ipfsHash });
                return res.status(200).end();
            })
        });
    } catch (e) {
        return res.status(500).send(e);
    }
}
