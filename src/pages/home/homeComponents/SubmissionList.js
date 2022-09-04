import { useState, useEffect } from "react";
import {
  projectFirestore,
  projectDatabase,
  addToArray,
} from "../../../firebase/config";

export default function SubmissionList({
  user,
  showList,
  setShowList,
  contestId,
  problems,
}) {
  const url =
    "https://codeforces.com/api/user.status?handle=" + user + "&from=1&count=1";
  const [prevSubmissionId, setPrevSubmissionId] = useState(null);
  const [submissionList, setSubmissionList] = useState(null);
  const [totalTime,setTotalTime] = useState(null);
  const [time, setTime] = useState(null);
  const [error, setError] = useState(null);

  // catch the submission List from database
  useEffect(() => {
    const ref = projectFirestore.collection("LiveContestData").doc(contestId);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setSubmissionList(snapshot.data().submissions);
        setTotalTime(snapshot.data().totalTime);
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
      problems.map(async (problem) => {
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
        }
      });
    }
  };

  // Checks for user submission at every 20 seconds
  useEffect(() => {
    const intervalID = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalID);
  }, [prevSubmissionId]);

  return (
    <div>
      {showList && <button onClick={() => setShowList(false)}>Click</button>}
      {showList && submissionList && submissionList.length === 0 && (
        <h2>No submission</h2>
      )}
      {showList &&
        submissionList &&
        submissionList.length !== 0 &&
        submissionList.map((submission) => (
          <div>
            <p>{submission.user}</p>
            <p>{submission.problemName}</p>
            <p>{submission.verdict}</p>
            <p>{submission.passedTestCount}</p>
            <p>{submission.timeLimit}</p>
            <p>{submission.memoryLimit}</p>
            <p>{submission.language}</p>
            <p>{submission.time}</p>
          </div>
        ))}
    </div>
  );
}
