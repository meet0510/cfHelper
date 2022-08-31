import { useState, useEffect } from "react";
import { useCollection } from "../../../hooks/useCollection";
import Sidebar from '../homeSidebar/Sidebar'
import "./DisplayContest.css";

export default function DisplayContest({ contestId }) {
  const [problems, setProblems] = useState(null);
  const [time, setTime] = useState(null);
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
      setProblems(documents[0].problems);
      setTime(documents[0].time);
    }
  }, [documents, bug]);

  return (
    <div className="contest-box">
      {error && <p className="error">{error}</p>}
      {!problems && <p className="error">Pending!!</p>}
      {problems && <Sidebar contestId={contestId} />}
      {problems && (
        <table className="problem-box">
          <tbody>
            <tr>
              <th>ContestID</th>
              <th>Index</th>
              <th>ProblemName</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
            {problems.map((problem) => (
              <tr key={problem.id} className="problem">
                <td>
                  <a
                    href={"https://codeforces.com/contest/" + problem.contestId}
                    target="_blank"
                  >
                    {problem.contestId}
                  </a>
                </td>
                <td>{problem.index}</td>
                <td>
                  <a
                    href={
                      "https://codeforces.com/contest/" +
                      problem.contestId +
                      "/problem/" +
                      problem.index
                    }
                    target="_blank"
                  >
                    {problem.name}
                  </a>
                </td>
                <td>
                  <img
                    src="https://cdn.codeforces.com/s/18439/images/icons/submit-22x22.png"
                    alt="Submit"
                  ></img>
                </td>
                <td>{problem.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
