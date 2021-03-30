/** @jsxImportSource @emotion/react */
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Switch, Route } from "react-router-dom";
import { FactionAdmin, FighterClassAdmin } from "./components/admin";
import LoginButton from "./components/Login";
import LogoutButton from "./components/Logout";
import { cluster } from "./styles";

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
            </div>
          </div>
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
