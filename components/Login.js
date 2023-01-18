import { useMetamask } from '@thirdweb-dev/react'

const Login = () => {
  const connectWithMetamask = useMetamask()
  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        height: '70vh',
        flexWrap: 'wrap'
      }}
    >
      <div>
        <button
          className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
          onClick={connectWithMetamask}
        >
          Sign in using MetaMask
        </button>
        <div style={{ display: 'flex', margin: '20px', justifyContent: "center" }}>
          <img
            width={'80px'}
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png'
          />
          <div style={{ width: '30px' }}></div>
          <img
            width={'50px'}
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Eth-diamond-rainbow.png/460px-Eth-diamond-rainbow.png'
          />
        </div>
      </div>
    </div>
  )
}
export default Login
