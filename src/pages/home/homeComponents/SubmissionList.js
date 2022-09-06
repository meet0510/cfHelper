import { useState, useEffect, useCallback } from "react";
import { projectFirestore, addToArray } from "../../../firebase/config";
import "./SubmissionList.css";

export default function SubmissionList({
  user,
  showList,
  contestId,
  problems,
  index,
}) {
  const url =
    "https://codeforces.com/api/user.status?handle=" + user + "&from=1&count=1";
  const [prevSubmissionId, setPrevSubmissionId] = useState(null);
  const [submissionList, setSubmissionList] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [error, setError] = useState(null);

  // catch the submission List from database
  useEffect(() => {
    const ref = projectFirestore.collection("LiveContestData").doc(contestId);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setSubmissionList(snapshot.data().submissions);
        setTotalTime(snapshot.data().totalTime);
        console.log(snapshot.data().users)
        console.log(userStatus)
        setUserStatus(snapshot.data().users);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch the ID of prev submitted solution
  useEffect(async () => {
    const res = await fetch(url);
    const data = await res.json();

    if (data) {
      setPrevSubmissionId(data.result[0].id);
    }
  }, []);

  // Function to get the data of submission
  const fetchData = async () => {
    const res = await fetch(url);
    const data = await res.json();

    if (
      data !== null &&
      prevSubmissionId !== null &&
      data.result[0].id !== prevSubmissionId &&
      data.result[0].verdict !== "TESTING"
    ) {
      setPrevSubmissionId(data.result[0].id);
      problems.map(async (problem, index_) => {
        if (
          problem.contestId === data.result[0].contestId &&
          problem.index === data.result[0].problem.index
        ) {
          const res = await projectFirestore
            .collection("LiveContestData")
            .doc(contestId)
            .get();

          const submission = {
            user: user,
            problemName: data.result[0].problem.name,
            verdict: data.result[0].verdict,
            passedTestCount: data.result[0].passedTestCount,
            timeLimit: data.result[0].timeConsumedMillis,
            memoryLimit: data.result[0].memoryConsumedBytes,
            language: data.result[0].programmingLanguage,
            time: totalTime - res.data().timeLeft,
          };

          // add submission to database if it matches
          try {
            await projectFirestore
              .collection("LiveContestData")
              .doc(contestId)
              .update({
                submissions: addToArray(submission),
              });
          } catch (err) {
            console.log(err.message);
            setError(err.message);
          }

          // update user Status
          let new_verdict = null;
          let new_user_status = userStatus;

          if (userStatus[index].status[index_] === "IDLE") {
            if (data.result[0].verdict !== "OK") {
              new_verdict = "REJECTED";
              new_user_status[index].status[index_] = new_verdict;
            } else {
              new_verdict = "OK";
              new_user_status[index].status[index_] = new_verdict;
            }
          } else if (userStatus[index].status[index_] === "REJECTED") {
            if (data.result[0].verdict === "OK") {
              new_verdict = "OK";
              new_user_status[index].status[index_] = new_verdict;
            }
          }

          if (new_verdict !== null) {
            const ref = projectFirestore
              .collection("LiveContestData")
              .doc(contestId);
            ref.update({ users: new_user_status });
          }
        }
      });
    }
  };

  // Checks for user submission at every 20 seconds
  useEffect(useCallback(() => {
    const intervalID = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalID);
  }), [prevSubmissionId]);

  return (
    <>
      {showList && submissionList && submissionList.length === 0 && (
        <h2 className="no">No submission Yet!!</h2>
      )}
      {showList && submissionList && submissionList.length !== 0 && (
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
            {submissionList.map((submission) => (
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
    </>
  );
}
