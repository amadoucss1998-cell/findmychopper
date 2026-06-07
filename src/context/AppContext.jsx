import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'passenger' | 'admin'

  function login(userData, userRole) {
    setUser(userData);
    setRole(userRole);
  }

  function logout() {
    setUser(null);
    setRole(null);
  }

  return (
    <AppContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
