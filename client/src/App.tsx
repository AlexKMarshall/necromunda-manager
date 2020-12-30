import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Factions from "./components/Factions";
import FighterClasses from "./components/FighterClasses";
import FighterPrototypes from "./components/FighterPrototypes";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Factions />
        <FighterClasses />
        <FighterPrototypes />
      </div>
    </QueryClientProvider>
  );
}

export default App;
