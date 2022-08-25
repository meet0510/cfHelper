import { useState, useEffect } from "react";
import { useFetch } from "./useFetch";

export const useCreateContest = (rating, users) => {
  const url = "https://codeforces.com/api/problemset.problems";
  const [allProblems, setAllProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState(new Map());
  const [unsolvedProblems, setUnsolvedProblems] = useState([]);
  const [contestProblems, setContestProblems] = useState([]);
  let tempProblems = [];
  const { data, isPending, error } = useFetch(url);

  // Fetch every problem from Api
  useEffect(() => {
    if (data) {
      setAllProblems(data.result.problems);
    }
  }, [data]);

  // Update the map of solved problems [(contestId + index) => unique]
  const updateMap = (key, value) => {
    setSolvedProblems(solvedProblems.set(key, value));
  };

  // Function to find solved problem for a user
  const FindSolvedProblems = (user) => {
    const url = "https://codeforces.com/api/user.status?handle=" + user;
    const { data, error } = useFetch(url);

    if (error) {
      console.log(error);
    }

    if (data) {
      data.result.map((p) => {
        if (p.verdict === "OK") {
          if (
            solvedProblems.get(p.problem.contestId + p.problem.index) ===
            undefined
          ) {
            updateMap(p.problem.contestId + p.problem.index, 1);
          }
        }
      });
    }
  };

  // Find solved problems of all users
  users.map((user) => FindSolvedProblems(user));

  // Filter out solved problems from all problems
  useEffect(() => {
    setUnsolvedProblems(
      allProblems.filter((e) => {
        return solvedProblems.get(e.contestId + e.index) !== 1;
      })
    );
  }, [allProblems,solvedProblems]);

  // Function to generate random problem of a given rating
  const TakeProblems = (rating) => {
    if (unsolvedProblems.length === 0) {
      return;
    } else {
      const temp = unsolvedProblems.filter((e) => {
        return e.rating === rating;
      });

      const randomProblem = temp[Math.floor(Math.random() * temp.length)];

      if (randomProblem !== undefined) {
        tempProblems.push(randomProblem);
      }
    }
  };

  // Generate contest problems from given rating array
  useEffect(() => {
    {rating && rating.map((curr_rating) => TakeProblems(curr_rating))};

    if (tempProblems.length !== 0) {
      setContestProblems(tempProblems);
    }
  }, [unsolvedProblems]);

  return { contestProblems, isPending, error };
};
