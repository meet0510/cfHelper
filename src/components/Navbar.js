import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const path = useLocation().pathname;

  return (
    <div className="navbar">
      <ul>
        <li className="logo">cfHelp</li>

        {!user && (
          <>
            <li>
              <Link to="/login" className="btn">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="btn">
                Signup
              </Link>
            </li>
          </>
        )}
        {user && (
          <>
            <li>
              <a
                href={"https://codeforces.com/profile/" + user.displayName}
                className="profile"
                target="_blank"
                rel="noreferrer"
              >
                {user.displayName}
              </a>
            </li>
            {path !== "/solo" && (
              <li>
                <Link to="/solo" className="btn">
                  Solo
                </Link>
              </li>
            )}
            {path !== "/group" && (
              <li>
                <Link to="/group" className="btn">
                  Group
                </Link>
              </li>
            )}
            <li>
              <button onClick={logout} className="btn">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
