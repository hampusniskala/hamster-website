import { createContext, useContext, useState } from "react";

const HamsterContext = createContext();

export const useHamsterContext = () => useContext(HamsterContext);

export function HamsterProvider({ children }) {
  const [selectedHamsterTokenId, setSelectedHamsterTokenId] = useState(null);

  return (
    <HamsterContext.Provider value={{ selectedHamsterTokenId, setSelectedHamsterTokenId }}>
      {children}
    </HamsterContext.Provider>
  );
}
