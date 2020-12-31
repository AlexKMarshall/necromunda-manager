import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Factions from "./components/Factions";
import FighterClasses from "./components/FighterClasses";
import FighterPrototypes from "./components/FighterPrototypes";
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
      <Factions />
      <FighterClasses />
      <FighterPrototypes />
      <Gangs />
    </>
  );
}

function UnauthenticatedApp() {
  return <LoginButton />;
}

export default App;
