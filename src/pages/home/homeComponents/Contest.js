import { useCollection } from "../../../hooks/useCollection";
import { useCreateContest } from "../../../hooks/useCreateContest";
import { useEffect, useState } from "react";
import "./Contest.css";

export default function Contest({ user, time }) {
  const [rating, setRating] = useState(null);
  const [error, setError] = useState(null);
  const { documents, error: bug } = useCollection("user", [
    "uid",
    "==",
    user.uid,
  ]);
  const {
    contestProblems,
    isPending,
    error: err,
  } = useCreateContest(rating, [user.displayName]);
  console.log(contestProblems,isPending);

  useEffect(() => {
    if (bug) {
      setError(bug);
    }

    if (documents) {
      setRating(documents[0].activeSoloContest);
    }
  }, [documents, bug]);

  if (err) {
    setError(err);
  }

  return (
    <div>
      {isPending && <p>Have patient !!!</p>}
      {error && <p className="error">{error}</p>}
      {!isPending && !error && (
        <h2>contest</h2>
      )}
    </div>
  );
}
