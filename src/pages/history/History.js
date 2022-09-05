import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";
import "./History.css";

export default function History() {
  const { user } = useAuthContext();
  const [contests, setContests] = useState(null);
  const [showCompleteDetails,setShowCompleteDetails] = useState(false);
  const [index,setIndex] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = projectFirestore
      .collection("PastContestData")
      .doc(user.displayName);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        const data = snapshot.data().ContestList.sort((a, b) => {
          return (
            new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate())
          );
        });

        setContests(data);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    return () => unsubscribe();
  }, []);

  const handleClick = (index_) => {
    setIndex(index_);
    setShowCompleteDetails(true);
  }

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {contests && !showCompleteDetails && (
        <ul className="history">
          {contests.map((contest,index) => (
            <li key={index} onClick={() => handleClick(index)}>
              <p>{index + 1}</p>
              <p>Time : {contest.totalTime}</p>
              <p>Date : {contest.createdAt.toDate().toString()}</p>
            </li>
          ))}
        </ul>
      )}
      {contests && showCompleteDetails && console.log(contests[index])}
    </div>
  );
}
