import React, { createContext, useContext, useState } from "react";

const HamsterContext = createContext();

export function HamsterProvider({ children }) {
  const [selectedHamsterTokenId, setSelectedHamsterTokenId] = useState(null);
  const [selectedEnemyTokenId, setSelectedEnemyTokenId] = useState(null);

  return (
    <HamsterContext.Provider
      value={{
        selectedHamsterTokenId,
        setSelectedHamsterTokenId,
        selectedEnemyTokenId,
        setSelectedEnemyTokenId,
      }}
    >
      {children}
    </HamsterContext.Provider>
  );
}

export function useHamsterContext() {
  const context = useContext(HamsterContext);
  if (!context) {
    throw new Error("useHamsterContext must be used within a HamsterProvider");
  }
  return context;
}
