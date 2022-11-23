import { useMetamask } from "@thirdweb-dev/react";

const Login = () => {
  const connectWithMetamask = useMetamask();
  return (
    <div>
      <button onClick={connectWithMetamask}>Sign in using MetaMask</button>
    </div>
  );
};
export default Login;