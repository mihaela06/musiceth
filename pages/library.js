import AudioCard from '../components/AudioCard'

export default function Library () {
  //TODO get only owned NFT CIDs from blockchain
  const CIDs = [
    'QmQgrF8444xYLMJbpFvsRpn8TsGexoP3R6tRAX22DAk9R1',
    'QmRA4LdmDbxht6ZYRnuDKLjxvVcrDBeGc6zcRuKWafDmSa'
  ]

  return (
    <div className='flex flex-wrap justify-center'>
      {CIDs.map(i => (
        <AudioCard key={i.cid} ipfsHash={i.cid} owned={true} />
      ))}
    </div>
  )
}
