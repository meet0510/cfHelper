import ContestDetails from "../homeComponents/ContestDetails";
import { useAuthContext } from "../../../hooks/useAuthContext";

import "./Solo.css";

export default function Solo() {
  const { user } = useAuthContext();

  return (
    <div>
      <ContestDetails user={ user } />
    </div>
  );
}
