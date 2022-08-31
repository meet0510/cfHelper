import { useEffect, useState } from "react";
import { useCollection } from "../../../hooks/useCollection";
import "./SolvedCount.css";

export default function SolvedCount({ contestId }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const { documents, error: bug } = useCollection(
    "liveContestData",
    null,
    null,
    contestId
  );

  useEffect(() => {
    if (bug) {
      setError(bug);
    }

    if (documents) {
      let solvedCount = documents[0].users.map((user) => {
        let count = 0;
        user.status.map((status) => {
          if (status === "OK") {
            count++;
          }
        });
        return { cfHandle: user.cfHandle, solved: count };
      });

      solvedCount.sort((a,b) => {
        return b.solved - a.solved;
      })

      setUsers(solvedCount);
    }
  }, [documents, bug]);

  return (
    <div className="solved-count-box">
      {users !== null &&
        users.map((user) => (
          <div>
            <p>{user.cfHandle}</p>
            <p>{user.solved}</p>
          </div>
        ))}
    </div>
  );
}
