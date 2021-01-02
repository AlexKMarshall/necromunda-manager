import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Switch, Route } from "react-router-dom";
import Factions from "./components/Factions";
import FighterClasses from "./components/FighterClasses";
import FighterPrototypes from "./components/FighterPrototypes";
import LoginButton from "./components/Login";
import LogoutButton from "./components/Logout";
import Gangs from "./components/Gangs";
import GangDetail from "./components/GangDetail";
import ItemTypes from "./components/ItemTypes";

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
            <Link to="/gangs">Gangs</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/admin">
          <Factions />
          <FighterClasses />
          <FighterPrototypes />
          <ItemTypes />
        </Route>
        <Route path="/gangs" exact>
          <Gangs />
        </Route>
        <Route path="/gangs/:gangId">
          <GangDetail />
        </Route>
      </Switch>
    </>
  );
}

function UnauthenticatedApp() {
  return <LoginButton />;
}

export default App;
