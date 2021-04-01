/** @jsxImportSource @emotion/react */
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Switch, Route } from "react-router-dom";
import {
  FactionAdmin,
  FighterClassAdmin,
  FighterPrototypeAdmin,
} from "./components/admin";
import { GangList } from "./components/gang-list";
import LoginButton from "./components/Login";
import LogoutButton from "./components/Logout";
import { cluster } from "./styles";
import { Gang } from "./pages";

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
          <div css={[cluster]}>
            <div>
              <FactionAdmin />
              <FighterClassAdmin />
              <FighterPrototypeAdmin />
            </div>
          </div>
        </Route>
        <Route path="/gangs" exact>
          <GangList />
        </Route>
        <Route path="/gangs/:id" exact>
          <Gang />
        </Route>
      </Switch>
    </>
  );
}

function UnauthenticatedApp() {
  return <LoginButton />;
}

export default App;
