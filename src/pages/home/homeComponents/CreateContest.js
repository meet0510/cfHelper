import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCollection } from "../../../hooks/useCollection";
import { useCreateContest } from "../../../hooks/useCreateContest";
import { projectFirestore } from "../../../firebase/config";
import DisplayContest from "./DisplayContest";
import "./CreateContest.css";

export default function CreateContest({ users, rating, time }) {
  const { user } = useAuthContext();
  const { contestProblems, isPending, error } = useCreateContest(rating, users);
  const [contestId, setContestId] = useState(null);
  const { documents } = useCollection("users", [
    "cfHandle",
    "==",
    user.displayName,
  ]);

  useEffect(() => {
    if (documents) {
      if (documents[0].runningContestId !== null) {
        setContestId(documents[0].runningContestId);
      }
    }
  }, [documents]);

  useEffect(() => {
    const addLiveContestData = async () => {
      const tempUsers = users.map((user) => {
        return {
          cfHandle: user,
          status: new Array(rating.length).fill("IDLE"),
        };
      });

      await projectFirestore
        .collection("LiveContestData")
        .doc(users[0])
        .set({
          users: tempUsers,
          timeLeft: time * 60,
          totalTime: time * 60,
          problems: contestProblems,
          submissions: [],
        });
    };

    const updateContestRunningStatus = async () => {
      users.map(async (user) => {
        await projectFirestore.collection("users").doc(user).update({
          runningContestId: users[0],
        });
      });
    };

    if (contestProblems.length !== 0) {
      addLiveContestData();
      updateContestRunningStatus();
    }
  }, [contestProblems]);

  return (
    <div>
      {isPending && <p className="error">Pending</p>}
      {error && <p className="error">{error}</p>}
      {!isPending && contestId !== null && (
        <DisplayContest contestId={contestId}/>
      )}
    </div>
  );
}
