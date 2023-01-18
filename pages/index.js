import AudioCard from '../components/AudioCard'

export default function Home () {
  //TODO get for sale NFT CIDs from blockchain
  const CIDs = [
    'QmQgrF8444xYLMJbpFvsRpn8TsGexoP3R6tRAX22DAk9R1',
    'QmRA4LdmDbxht6ZYRnuDKLjxvVcrDBeGc6zcRuKWafDmSa'
  ]

  return (
    <div className='flex flex-wrap justify-center'>
      {CIDs.map(i => (
        <AudioCard key={cid} ipfsHash={cid} owned={false} />
      ))}
    </div>
  )
}
