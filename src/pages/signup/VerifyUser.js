import { useEffect } from "react";
import { useSignup } from "../../hooks/useSignup";
import "./VerifyUser.css";

export default function VerifyUser(props) {
  const { signup, isPending, error } = useSignup();

  useEffect(() => {
    const intervalID = setInterval(() => {
      const url =
        "https://codeforces.com/api/user.status?handle=" +
        props.displayName +
        "&from=1&count=1";

      const fetchData = async () => {
        const res = await fetch(url);
        const data = await res.json();

        data &&
          data.result[0].problem.contestId === 4 &&
          data.result[0].problem.index === "A" &&
          props.setVerified(true);
      };

      fetchData();
    }, 2000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className="verify-user">
      {props.verified && <p>Successfully Verified !!!</p>}
      {props.verified && !isPending && (
        <button
          className="btn"
          onClick={() => signup(props.email, props.password, props.displayName)}
        >
          Signup
        </button>
      )}
      {props.verified && isPending && (
        <button disabled className="btn">
          loading
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
