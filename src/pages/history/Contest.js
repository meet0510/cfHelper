import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Contest.css";

export default function Contest({ contest, setShowCompleteDetails }) {
  const [showSubmissionList, setShowSubmissionList] = useState(false);
  let status = null;
  const { user: user_ } = useAuthContext();

  let solvedCount = contest.users.map((user) => {
    if (user.cfHandle === user_.displayName) {
      status = user.status;
    }
    
    let count = 0;
    user.status.map((status) => {
      if (status === "OK") {
        count++;
      }
    });
    return { cfHandle: user.cfHandle, solved: count };
  });

  solvedCount.sort((a, b) => {
    return b.solved - a.solved;
  });

  console.log(solvedCount);

  return (
    <div className="contest-box">
      <div>
        <div className="side-bar">
          {solvedCount.map((solved) => (
            <div className="flex">
              <p>{solved.cfHandle}</p>
              <p>{solved.solved}</p>
            </div>
          ))}
        </div>
        {!showSubmissionList && (
          <button className="btn" onClick={() => setShowSubmissionList(true)}>
            Show Submission!
          </button>
        )}
        {showSubmissionList && (
          <button className="btn" onClick={() => setShowSubmissionList(false)}>
            Go Back!
          </button>
        )}
        <button className="btn" onClick={() => setShowCompleteDetails(false)}>
          Go Back to History!
        </button>
      </div>
      {!showSubmissionList && (
        <table className="problem-box">
          <tbody>
            <tr>
              <th>ContestID</th>
              <th>Index</th>
              <th>ProblemName</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
            {contest.problems.map((problem,index) => (
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
      {showSubmissionList && (
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
                <td>{submission.verdict}</td>
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
