import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Switch, Route } from "react-router-dom";
import { FactionAdmin } from "./components/admin/faction-admin";
import LoginButton from "./components/Login";
import LogoutButton from "./components/Logout";
import Gangs from "./components/Gangs";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function AuthenticatedApp() {
  return (
    <>
      <LogoutButton />
      <nav>
        <ul>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          <li>
            <Link to="/gangs">Gangs</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/admin">
          <FactionAdmin />
        </Route>
        <Route path="/gangs" exact>
          {/* <Gangs /> */}
        </Route>
      </Switch>
    </>
  );
}

function UnauthenticatedApp() {
  return <LoginButton />;
}

export default App;
