import { useEffect, useState } from "react";
import { useCollection } from "../../../../hooks/useCollection";
import "./Rank.css";

export default function Rank({ user }) {
  const [solved, setSolved] = useState(0);
  const [error, setError] = useState(null);
  const { documents, error: bug } = useCollection("users", [
    "cfHandle",
    "==",
    user,
  ]);

  useEffect(() => {
    if (bug) {
      setError(bug);
    }

    if (documents) {
      let temp = 0;

      documents[0].liveSoloContest.contestProblems.map((problem) => {
        if (problem.solved === true) {
          temp++;
        }
      });

      setSolved(temp);
    }
  }, [documents, error]);

  return (
    <div className="rank">
      {error && <p className="error">{error}</p>}
      <a
        href={"https://codeforces.com/profile/" + user.displayName}
        className="profile"
        target="_blank"
        rel="noreferrer"
      >
        {user}
      </a>
      <p>{solved}</p>
    </div>
  );
}
