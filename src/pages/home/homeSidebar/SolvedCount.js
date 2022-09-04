import { useEffect, useState } from "react";
import { projectFirestore } from "../../../firebase/config";
import "./SolvedCount.css";

export default function SolvedCount({ contestId }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    const ref = projectFirestore.collection("LiveContestData").doc(contestId);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setDocuments(snapshot.data());
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
      let solvedCount = documents.users.map((user) => {
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
  }, [documents]);

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
