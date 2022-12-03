import AudioCard from '../components/AudioCard'

export default function Home () {
  //TODO get NFT CIDs from blockchain
  const CIDs = [
    'QmQgrF8444xYLMJbpFvsRpn8TsGexoP3R6tRAX22DAk9R1',
    'QmRA4LdmDbxht6ZYRnuDKLjxvVcrDBeGc6zcRuKWafDmSa'
  ]

  return (
    <div className='flex flex-wrap justify-center'>
      {CIDs.map(cid => (
        <AudioCard key={cid} ipfsHash={cid} />
      ))}
    </div>
  )
}
