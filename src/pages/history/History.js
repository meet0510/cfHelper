import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectFirestore } from "../../firebase/config";
import "./History.css";

export default function History() {
  const { user } = useAuthContext();
  const [contests, setContests] = useState(null);
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

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {contests &&
        contests.map((contest) => (
          <p>{contest.createdAt.toDate().toString()}</p>
        ))}
    </div>
  );
}
