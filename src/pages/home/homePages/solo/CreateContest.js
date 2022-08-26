import { useEffect, useState } from "react";
import { useCreateContest } from "../../../../hooks/useCreateContest";
import { projectFirestore, fieldValue } from "../../../../firebase/config"
import DisplayContest from "./DisplayContest";
import "./CreateContest.css"

export default function CreateContest({ user, rating, time }) {
  const { contestProblems, isPending, error } = useCreateContest(rating, [
    user.displayName,
  ]);

  useEffect(() => {
    const addContestData = async () => {
      await projectFirestore.collection("users").doc(user.uid).update({
        "liveSoloContest.user" : user.displayName,
        "liveSoloContest.time" : time,
        "liveSoloContest.contestProblems" : contestProblems
      });
    };

    if (contestProblems.length !== 0) {
      addContestData();
    }
  }, [contestProblems]);

  return (
    <div>
      {isPending && <p>Pending</p>}
      {error && <p className="error">{error}</p>}
      {!isPending && <DisplayContest />}
    </div>
  );
}
