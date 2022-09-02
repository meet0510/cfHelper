import { projectFirestore } from "../../../firebase/config";
import { useState, useEffect } from "react";
import SolvedCount from "./SolvedCount";
import "./Sidebar.css";

export default function Sidebar({ contestId }) {
  const [time,setTime] = useState(null);

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
  }, [])

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(prevTime => prevTime - 1)
    }, 60000);

    return () => clearInterval(intervalID);
  }, [])

  useEffect(() => {
    const ref = projectFirestore.collection("liveContestData").doc(contestId);
    {time && ref.update({ time: time })}
  }, [time])

  return (
    <div className="side-bar">
      <h2>{time} minutes left</h2>
      <SolvedCount contestId={contestId} />
    </div>
  );
}
