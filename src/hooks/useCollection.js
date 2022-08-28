import { useState, useEffect, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy, _id) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;
  const id = useRef(_id).current;

  useEffect(() => {
    let ref = projectFirestore.collection(collection);

    if (query) {
      ref = ref.where(...query);
    }

    if (orderBy) {
      ref = ref.orderBy(...orderBy);
    }

    if (id) {
      ref = ref.doc(id);
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        let results = [];

        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, query, orderBy, id]);

  return { documents, error };
};
