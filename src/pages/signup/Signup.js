import { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import "./Signup.css";
import Timer from "../../components/Timer";
import VerifyUser from "./VerifyUser";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [checkAuth, setCheckAuth] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timerValue, setTimerValue] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const { documents: handles } = useCollection("user");

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimerValue(1);
    setErrorMessage(null);
    let unique = true;

    for (let i = 0; i < handles.length; i++) {
      if (handles[i].cfHandle === displayName) {
        unique = false;
        break;
      }
    }

    if (unique === true) {
      setCheckAuth(true);
    } else {
      setErrorMessage("This handle already exist");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Signup</h2>
      {!checkAuth && (
        <label>
          <span>email :</span>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
      )}
      {!checkAuth && (
        <label>
          <span>password :</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
      )}
      {!checkAuth && (
        <label>
          <span>cf Handle :</span>
          <input
            type="text"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </label>
      )}
      {!checkAuth && <button className="btn">Verify</button>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {checkAuth && (
        <div className="verification">
          <div className="timer-box">
            <a
              href="https://codeforces.com/problemset/problem/4/A"
              target="_blank"
              rel="noreferrer"
            >
              Watermelon
            </a>
            <Timer minutes={5} seconds={0} passTimerValue={setTimerValue} />
          </div>
          {timerValue === 0 && setCheckAuth(false)}
          {timerValue === 0 && setErrorMessage("Session expired! Signup again")}
          <p className="error">
            Attempt this problem in given time to verify your cf handle
          </p>
          <VerifyUser
            email={email}
            password={password}
            displayName={displayName}
            verified={verified}
            setVerified={setVerified}
          />
        </div>
      )}
    </form>
  );
}
