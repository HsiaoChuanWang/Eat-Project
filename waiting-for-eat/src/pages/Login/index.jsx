import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

function Login() {
  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
  };

  return (
    <div className="App">
      <button onClick={login}>sign-in</button>
    </div>
  );
}

export default Login;
