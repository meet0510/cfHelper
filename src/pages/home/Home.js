import { useState, useRef, useEffect } from "react";
import { useCollection } from "../../hooks/useCollection";
import { projectFirestore } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import CreateContest from './homeComponents/CreateContest'
import "./Home.css";

export default function Home() {
  const { user } = useAuthContext();
  const [problems, setProblems] = useState("");
  const [time, setTime] = useState("");
  const [rating, setRating] = useState([]);
  const [tempRating, setTempRating] = useState("");
  const [tempUser, setTempUser] = useState("");
  const [users, setUsers] = useState([user.displayName]);
  const [createContest, setCreateContest] = useState(false);
  const { documents, error: bug } = useCollection("users", [
    "cfHandle",
    "==",
    user.displayName,
  ]);
  const { documents: document, error: err } = useCollection("users");
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);
  const ratingInput = useRef(null);
  const userInput = useRef(null);

  useEffect(() => {
    if (bug) {
      setError(bug);
    }

    if (documents) {
      setCreateContest(documents[0].contestRunning);
    }
  }, [documents, bug]);

  useEffect(() => {
    if (err) {
      setError(err);
    }

    if (document) {
      setAllUsers(document);
    }
  }, [document, err]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating.length !== parseInt(problems)) {
      window.alert("Please add matching details");
    } else {
      const updateData = async (cfHandle) => {
        try {
          await projectFirestore
            .collection("users")
            .doc(cfHandle)
            .update({ contestRunning: true });
        } catch (err) {
          setError(err);
        }
      };

      if (documents) {
        users.map((cfHandle) => updateData(cfHandle));
      }
    }
  };

  const resetRating = () => {
    setRating([]);
  };

  const resetUser = () => {
    setUsers([user.displayName]);
  };

  const handleRatingAdd = (e) => {
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

  const handleUserAdd = async (e) => {
    e.preventDefault();
    let authorized = false;

    if (users.includes(tempUser)) {
      userInput.current.setCustomValidity("User already present");
      userInput.current.reportValidity();
    } else {
      allUsers.map((user) => {
        if (
          user.cfHandle === tempUser &&
          user.contestRunning === false &&
          user.online === true
        ) {
          setUsers((prevUser) => [...prevUser, tempUser]);
          setTempUser("");
          userInput.current.focus();
          authorized = true;
        }
      });

      if (!authorized) {
        userInput.current.setCustomValidity(
          "Either user has not done signup or the contest is running"
        );
        userInput.current.reportValidity();
      }
    }
  };

  return (
    <div className="home">
      {!createContest && document && (
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
              <button className="btn" onClick={handleRatingAdd}>
                add
              </button>
              <button className="btn" type="reset" onClick={resetRating}>
                reset
              </button>
            </div>
          </label>
          {rating.length !== 0 && (
            <div className="show-rating">
              {rating.map((rating, index) => (
                <p key={index}>{rating}</p>
              ))}
            </div>
          )}
          <label>
            <span>Users :</span>
            <div className="users">
              <input
                type="text"
                onChange={(e) => setTempUser(e.target.value)}
                value={tempUser}
                ref={userInput}
              />
              <button className="btn" onClick={handleUserAdd}>
                add
              </button>
              <button className="btn" type="reset" onClick={resetUser}>
                reset
              </button>
            </div>
          </label>
          <div className="show-users">
            {users.map((user, index) => (
              <p key={index}>{user}</p>
            ))}
          </div>
          <button type="submit" className="btn">
            Start Contest
          </button>
          {error && <h2>{error}</h2>}
        </form>
      )}
      {createContest && <CreateContest users={users} rating={rating} time={time}/>}
    </div>
  );
}
