import { useCollection } from "../../../../hooks/useCollection";
import { useAuthContext } from "../../../../hooks/useAuthContext";

export default function DisplayContest() {
  const { user } = useAuthContext();
  const { documents, error } = useCollection("users", [
    "cfHandle",
    "==",
    user.displayName,
  ]);

  console.log(documents);
  return <div></div>;
}
