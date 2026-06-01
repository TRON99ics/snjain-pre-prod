import { createContext, useContext, useState, useMemo } from 'react';

const NavMenuContext = createContext(null);

export function NavMenuProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const value = useMemo(() => ({ menuOpen, setMenuOpen }), [menuOpen]);
  return <NavMenuContext.Provider value={value}>{children}</NavMenuContext.Provider>;
}

export function useNavMenu() {
  const ctx = useContext(NavMenuContext);
  if (!ctx) throw new Error('useNavMenu must be used within NavMenuProvider');
  return ctx;
}
