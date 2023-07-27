import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";
import "./Contest.css";

export default function Contest() {
  const { id } = useParams();
  const { user: user_ } = useAuthContext();
  const [showSubmissionList, setShowSubmissionList] = useState(false);
  const [contest, setContest] = useState(null);
  const [solvedCount, setSolvedCount] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = projectFirestore
      .collection("PastContestData")
      .doc(user_.displayName);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        const data = snapshot.data().ContestList.sort((a, b) => {
          return new Date(b.endedAt.toDate()) - new Date(a.endedAt.toDate());
        });

        setContest(data[id - 1]);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (contest) {
      let tempSolvedCount = contest.users.map((user) => {
        if (user.cfHandle === user_.displayName) {
          setStatus(user.status);
        }

        let count = 0;
        user.status.map((status) => {
          if (status === "OK") {
            count++;
          }
        });
        return { cfHandle: user.cfHandle, solved: count };
      });

      tempSolvedCount.sort((a, b) => {
        return b.solved - a.solved;
      });

      setSolvedCount(tempSolvedCount);
    }
  }, [contest]);

  return (
    <div className="contest-box">
      {error && <p className="error">{error}</p>}
      <div>
        {solvedCount && (
          <div className="side-box">
            {solvedCount.map((solved) => (
              <div className="flex">
                <p>
                  <a
                    className="profile"
                    href={"https://codeforces.com/profile/" + solved.cfHandle}
                    target="_blank"
                  >
                    {solved.cfHandle}
                  </a>{" "}
                  - {solved.solved}
                </p>
              </div>
            ))}
          </div>
        )}
        {!showSubmissionList && contest && solvedCount && (
          <button className="btn" onClick={() => setShowSubmissionList(true)}>
            Show Submission
          </button>
        )}
        {showSubmissionList && contest && solvedCount && (
          <button className="btn" onClick={() => setShowSubmissionList(false)}>
            Go Back
          </button>
        )}
      </div>
      {!showSubmissionList && contest && solvedCount && (
        <table className="problem-box">
          <tbody>
            <tr>
              <th>ContestID</th>
              <th>Index</th>
              <th>ProblemName</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
            {contest.problems.map((problem, index) => (
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
                {status[index] === "OK" && (
                  <td className="OK">
                    <img
                      src="https://cdn.codeforces.com/s/18439/images/icons/submit-22x22.png"
                      alt="Submit"
                    ></img>
                  </td>
                )}
                {status[index] === "REJECTED" && (
                  <td className="REJECTED">
                    <img
                      src="https://cdn.codeforces.com/s/18439/images/icons/submit-22x22.png"
                      alt="Submit"
                    ></img>
                  </td>
                )}
                {status[index] === "IDLE" && (
                  <td className="IDLE">
                    <img
                      src="https://cdn.codeforces.com/s/18439/images/icons/submit-22x22.png"
                      alt="Submit"
                    ></img>
                  </td>
                )}
                <td>{problem.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showSubmissionList && contest && solvedCount && (
        <table>
          <tbody>
            <tr>
              <th>cfHandle</th>
              <th>Name</th>
              <th>Verdict</th>
              <th>PassedTest</th>
              <th>TimeLimit</th>
              <th>MemoryLimit</th>
              <th>Language</th>
              <th>Time</th>
            </tr>
            {contest.submissions.map((submission) => (
              <tr key={submission.id} className="submission">
                <td>{submission.user}</td>
                <td>{submission.problemName}</td>
                <td className={submission.verdict === "OK" ? "OK" : "REJECTED"}>
                  {submission.verdict}
                </td>
                <td>{submission.passedTestCount}</td>
                <td>{submission.timeLimit} ms</td>
                <td>{submission.memoryLimit} kb</td>
                <td>{submission.language}</td>
                <td>
                  {Math.floor(submission.time / 60)} :{" "}
                  {Math.floor(submission.time % 60)} min
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
