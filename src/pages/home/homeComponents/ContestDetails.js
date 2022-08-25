import { useState, useRef, useEffect } from "react";
import { useCollection } from "../../../hooks/useCollection";
import { projectFirestore } from "../../../firebase/config";
import Contest from "./Contest";
import "./ContestDetails.css";

export default function ContestDetails({ user }) {
  const [problems, setProblems] = useState("");
  const [time, setTime] = useState("");
  const [rating, setRating] = useState([]);
  const [tempRating, setTempRating] = useState("");
  const [showContest, setShowContest] = useState(null);
  const { documents, error: bug } = useCollection("user", [
    "uid",
    "==",
    user.uid,
  ]);
  const [error, setError] = useState(null);
  const ratingInput = useRef(null);

  useEffect(() => {
    if (bug) {
      setError(bug);
    }

    if (documents) {
      setShowContest(documents[0].activeSoloContest);
    }
  }, [documents,bug]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating.length !== parseInt(problems)) {
      window.alert("Please add matching details");
    } else {
      const updateData = async () => {
        try {
          console.log(documents);
          await projectFirestore
            .collection("user")
            .doc(documents[0].id)
            .update({ ...documents[0], activeSoloContest: rating });
        } catch (err) {
          setError(err);
        }
      };

      if (documents) {
        updateData();
      }
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (tempRating < 800) {
      ratingInput.current.setCustomValidity(
        "Value must be greater than equal to 800"
      );
      ratingInput.current.reportValidity();
    } else if (tempRating > 3500) {
      ratingInput.current.setCustomValidity(
        "Value must be less than equal to 3500"
      );
      ratingInput.current.reportValidity();
    } else if (tempRating) {
      setRating((prevRating) => [
        ...prevRating,
        Math.floor(parseInt(tempRating) / 100) * 100,
      ]);
    }

    setTempRating("");
    ratingInput.current.focus();
  };

  const resetRating = () => {
    setRating([]);
  };

  return (
    <div>
      {!showContest && (
        <form onSubmit={handleSubmit} className="contest-details">
          <h2>Contest Details</h2>
          <label>
            <span>No. of problems :</span>
            <input
              type="number"
              onChange={(e) => setProblems(e.target.value)}
              value={problems}
              placeholder="1-10"
              min={1}
              max={10}
              required
            />
          </label>
          <label>
            <span>Contest Time (Minutes) :</span>
            <input
              type="number"
              onChange={(e) => setTime(e.target.value)}
              value={time}
              min={10}
              max={300}
              placeholder="10-300"
              required
            />
          </label>
          <label>
            <span>Rating :</span>
            <div className="rating">
              <input
                type="number"
                onChange={(e) => setTempRating(e.target.value)}
                value={tempRating}
                placeholder="800-3500"
                ref={ratingInput}
              />
              <button className="btn" onClick={handleAdd}>
                add
              </button>
              <button className="btn" type="reset" onClick={resetRating}>
                reset
              </button>
            </div>
          </label>
          <div className="show-rating">
            {rating.map((rating, index) => (
              <p key={index}>{rating}</p>
            ))}
          </div>
          <button type="submit" className="btn">
            Start Contest
          </button>
          {error && <h2>{error}</h2>}
        </form>
      )}
      {showContest && <Contest user={user} time={time}/>}
    </div>
  );
}
