import { projectFirestore } from "../../../firebase/config";
import { useState, useEffect } from "react";
import SolvedCount from "./SolvedCount";
import ContestEnd from "./ContestEnd";
import "./Sidebar.css";

export default function Sidebar({ contestId, isAdmin }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const ref = projectFirestore.collection("LiveContestData").doc(contestId);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setTime(snapshot.data().timeLeft);
      },
      (error) => {
        console.log(error);
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin && time > 0) {
      setTimeout(() => setTime(time - 1), 1000);
    }
  }, [time]);

  useEffect(() => {
    if (isAdmin && time !== null) {
      const ref = projectFirestore.collection("LiveContestData").doc(contestId);
      ref.update({ timeLeft: time });
    }
  }, [time]);

  return (
    <div className="side-bar">
      <h2>
        {Math.floor(time / 60)} : {Math.floor(time % 60)}
      </h2>
      <SolvedCount contestId={contestId} />
      {time === 0 && isAdmin && <ContestEnd contestId={contestId} />}
    </div>
  );
}
