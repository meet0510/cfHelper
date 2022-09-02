import { useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../../../firebase/config";

export default function ContestEnd({ contestId }) {
  const [contestData, setContestData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = projectFirestore.collection("liveContestData").doc(contestId);

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
    if (contestData !== null) {
      // add contest-data to past-contest data
      contestData.users.map(async (user) => {
        try {
          const { time, ...contestDataWithOutTime } = contestData;
          const createdAt = timestamp.fromDate(new Date());
          await projectFirestore.collection("PastContestData").add({
            ...contestDataWithOutTime,
            cfHandle: user.cfHandle,
            createdAt,
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
          .collection("liveContestData")
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
