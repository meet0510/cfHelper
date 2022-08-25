import { useState, useEffect } from "react";
import "./Timer.css"

export default function Timer(props) {
  const minutes = props.minutes;
  const seconds = props.seconds;
  const totalSeconds = minutes * 60 + seconds;
  const [currSeconds, setCurrSeconds] = useState(totalSeconds);

  useEffect(() => {
    currSeconds === 0 && props.passTimerValue(0);
  }, [currSeconds, props])

  useEffect(() => {
    currSeconds > 0 && setTimeout(() => setCurrSeconds(currSeconds - 1), 1000);
  }, [currSeconds]);

  return (
    <div className="timer">
      {Math.floor(currSeconds / 60)} : {Math.floor(currSeconds % 60)}
    </div>
  );
}
