import { projectFirestore } from "../../../firebase/config";
import { useState, useEffect } from "react";
import SolvedCount from "./SolvedCount";
import "./Sidebar.css";

export default function Sidebar({ contestId }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const ref = projectFirestore.collection("liveContestData").doc(contestId);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setTime(snapshot.data().time);
      },
      (error) => {
        console.log(error);
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    time > 0 && setTimeout(() => setTime(time - 1), 1000);
  }, [time]);

  useEffect(() => {
    const ref = projectFirestore.collection("liveContestData").doc(contestId);
    {
      time && ref.update({ time: time });
    }
  }, [time]);

  return (
    <div className="side-bar">
      <h2>
        {Math.floor(time / 60)} : {Math.floor(time % 60)}
      </h2>
      <SolvedCount contestId={contestId} />
    </div>
  );
}
