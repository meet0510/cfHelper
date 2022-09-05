import { useEffect, useState } from "react";
import {
  projectFirestore,
  timestamp,
  addToArray,
} from "../../../firebase/config";

export default function ContestEnd({ contestId }) {
  const [contestData, setContestData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = projectFirestore.collection("LiveContestData").doc(contestId);

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setContestData(snapshot.data());
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(async () => {
    if (contestData !== null && contestData.timeLeft === 0) {
      // add contest-data to past-contest data
      contestData.users.map(async (user) => {
        try {
          const { timeLeft, ...contestDataWithOutTime } = contestData;
          const endedAt = timestamp.fromDate(new Date());
          await projectFirestore
            .collection("PastContestData")
            .doc(user.cfHandle)
            .update({
              ContestList: addToArray({ ...contestDataWithOutTime, endedAt }),
            });
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        }
      });

      // update status of contestRunning & runningContestId
      contestData.users.map(async (user) => {
        try {
          await projectFirestore
            .collection("users")
            .doc(user.cfHandle)
            .update({ contestRunning: false, runningContestId: null });
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        }
      });

      // remove contest from live contest
      try {
        await projectFirestore
          .collection("LiveContestData")
          .doc(contestId)
          .delete();
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      }
    }
  }, [contestData]);

  return <div></div>;
}
