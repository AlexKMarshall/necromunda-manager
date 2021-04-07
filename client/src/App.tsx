/** @jsxImportSource @emotion/react */
import { useAuth0 } from "@auth0/auth0-react";
import { Link, Switch, Route } from "react-router-dom";
import {
  FactionAdmin,
  FighterClassAdmin,
  FighterPrototypeAdmin,
  WeaponAdmin,
  TraitAdmin,
} from "./components/admin";
import { GangList } from "./components/gang-list";
import LoginButton from "./components/Login";
import LogoutButton from "./components/Logout";
import { FieldArray } from "./components/field-array";
import { cluster } from "./styles";
import { Gang } from "./pages";
import { EditableTable } from "./components/editable-table";

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
          <li>
            <Link to="/array">Field Array</Link>
          </li>
          <li>
            <Link to="/table">Editable Table</Link>
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
              <TraitAdmin />
              <WeaponAdmin />
            </div>
          </div>
        </Route>
        <Route path="/gangs" exact>
          <GangList />
        </Route>
        <Route path="/gangs/:id" exact>
          <Gang />
        </Route>
        <Route path="/array" exact>
          <FieldArray />
        </Route>
        <Route path="/table" exact>
          <EditableTable />
        </Route>
      </Switch>
    </>
  );
}

function UnauthenticatedApp() {
  return <LoginButton />;
}

export default App;
