import AudioCard from "../components/AudioCard";
import Web3 from "web3";
import { ERC721ABI } from "./ERC721ABI";

const nftAddress = "0xFDd50cF5012E09a276c0Aef33F1410485a2d0A98";
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(ERC721ABI, nftAddress);

export default function Home() {
  let CIDs = contract.getOnSaleNFTs();

  return (
    <div className="flex flex-wrap justify-center">
      {CIDs.map((cid) => (
        <AudioCard key={cid} ipfsHash={cid} owned={false} />
      ))}
    </div>
  );
}
