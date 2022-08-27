import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import "./Timer.css";

export default function Timer(props) {
  const minutes = props.minutes;
  const seconds = props.seconds;
  const totalSeconds = minutes * 60 + seconds;
  const [currSeconds, setCurrSeconds] = useState(totalSeconds);

  useEffect(() => {
    currSeconds === 0 && props.passTimerValue(0);
  }, [currSeconds, props]);

  useEffect(() => {
    currSeconds > 0 && setTimeout(() => setCurrSeconds(currSeconds - 1), 1000);
  }, [currSeconds]);

  return (
    <div className="timer">
      <p>
        <FontAwesomeIcon icon={faClock} />{" "}
      </p>
      <p className="time">
        {Math.floor(currSeconds / 60)} : {Math.floor(currSeconds % 60)}
      </p>
    </div>
  );
}
