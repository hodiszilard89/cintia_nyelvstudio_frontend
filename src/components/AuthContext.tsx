import { createContext, useContext, useState } from 'react';

// 1. Definiáljuk, milyen adatai vannak a Google-ből jövő felhasználónak
export interface User {
  email?: string;
  name?: string;
  picture?: string;
}

// 2. Definiáljuk, mit tud a mi globális bejelentkezési rendszerünk
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// 3. Létrehozzuk a Context-et
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Ez a "csomagoló" fogja körbeölelni az alkalmazásunkat
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('studentData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

 const login = (userData: User) => {
    setUser(userData);
    // 2. Bejelentkezéskor lementjük a böngésző memóriájába is
    localStorage.setItem('studentData', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    // 3. Kijelentkezéskor kitöröljük a memóriából
    localStorage.removeItem('studentData');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Ez egy saját kis Hook, amivel bármelyik fájlból könnyen elérhetjük a login-t és a user-t
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('A useAuth Hook-ot csak egy AuthProvider-en belül lehet használni!');
  }
  return context;
};