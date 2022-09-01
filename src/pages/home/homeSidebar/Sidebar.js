import { projectFirestore } from "../../../firebase/config";
import { useState, useEffect } from "react";
import SolvedCount from "./SolvedCount";
import "./Sidebar.css";

export default function Sidebar({ contestId, startTime }) {
  const [time,setTime] = useState(startTime);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(prevTime => prevTime - 1)
    }, 60000);

    return () => clearInterval(intervalID);
  }, [])

  useEffect(() => {
    const ref = projectFirestore.collection("liveContestData").doc(contestId);
    ref.update({ time: time });
  }, [time])

  return (
    <div className="side-bar">
      <h2>{time} minutes left</h2>
      <SolvedCount contestId={contestId} />
    </div>
  );
}
