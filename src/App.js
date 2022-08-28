import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import History from "./pages/history/History"
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path="/">
              {user && <Home />}
              {!user && <Redirect to="/login" />}
            </Route>
            <Route exact path="/login">
              {!user && <Login />}
              {user && <Redirect to="/" />}
            </Route>
            <Route exact path="/signup">
              {!user && <Signup />}
              {user && <Redirect to="/" />}
            </Route>
            <Route exact path="/history">
              {user && <History />}
              {!user && <Redirect to="/login" />}
            </Route>
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
