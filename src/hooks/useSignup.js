import { useEffect, useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!res) {
        throw new Error("could not complete signup");
      }

      // add props to user
      await res.user.updateProfile({ displayName: displayName });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      // add user to database
      await projectFirestore.collection("users").doc(res.user.displayName).set({
        cfHandle: res.user.displayName,
        online: true,
        contestRunning: false,
        runningContestId: null,
      });

      await projectFirestore
        .collection("PastContestData")
        .doc(res.user.displayName)
        .set({
          ContestList: [],
        });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
