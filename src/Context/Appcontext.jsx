// context/AppContext.jsx
import { useState } from "react";
import { AppContext } from './useAppContext';

export function Provider({ children }) {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
