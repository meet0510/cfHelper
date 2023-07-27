import { useState, useEffect } from "react";
import { projectFirestore } from "../../../firebase/config";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Sidebar from "../homeSidebar/Sidebar";
import SubmissionList from "./SubmissionList";
import "./DisplayContest.css";

export default function DisplayContest({ contestId }) {
  const { user } = useAuthContext();
  const [problems, setProblems] = useState(null);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [status, setStatus] = useState(null);
  const [showSubmissionList, setShowSubmissionList] = useState(false);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    const ref = projectFirestore.collection("LiveContestData").doc(contestId);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setDocuments(snapshot.data());
        snapshot.data().users.map((user_) => {
          if (user_.cfHandle === user.displayName) {
            setStatus(user_.status);
          }
        });
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (documents) {
      setProblems(documents.problems);

      documents.users.map((user_, index) => {
        if (user_.cfHandle === user.displayName) {
          setIndex(index);
        }
      });
    }
  }, [documents]);

  return (
    <div className="contest-box">
      {error && <p className="error">{error}</p>}
      {!problems && <p className="error">Wait</p>}
      <div className="side">
        {problems && (
          <Sidebar
            contestId={contestId}
            isAdmin={documents.users[0].cfHandle === user.displayName}
          />
        )}
        {problems && !showSubmissionList && (
          <button className="btn" onClick={() => setShowSubmissionList(true)}>
            Show Submission
          </button>
        )}
        {problems && showSubmissionList && (
          <button className="btn" onClick={() => setShowSubmissionList(false)}>
            Go Back
          </button>
        )}
      </div>
      {problems && !showSubmissionList && (
        <table className="problem-box">
          <tbody>
            <tr>
              <th>ContestID</th>
              <th>Index</th>
              <th>ProblemName</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
            {problems.map((problem, index) => (
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
      {problems && (
        <SubmissionList
          user={user.displayName}
          showList={showSubmissionList}
          contestId={contestId}
          problems={problems}
          index={index}
        />
      )}
    </div>
  );
}
