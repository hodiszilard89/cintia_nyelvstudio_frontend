import { Box } from '@chakra-ui/react'
import { Navbar } from "./components/navbarV2/NavBar"
import { Hero } from './components/Hero';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { UnitPage } from './components/UnitPage';
import { Profile } from './components/Profile';
import {ProtectedRoute} from './components/ProtectedRoute'

const App = () => {
  return (
    <Box
      minH="100vh"
      w="100%"
      bgGradient="linear(to-br, #3b1c68, blue.900)"
      color="white"
    >
      {/* A Navbar fixen kint marad minden oldalon */}
      <Navbar />

      {/* Itt dől el, melyik oldal jelenjen meg */}
<Routes>
        {/* FŐOLDAL (Publikus) */}
        <Route path="/" element={<Hero />} />
        
        {/* KURZUSOK (Védett) */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* TANANYAG OLDAL (Védett) */}
        <Route path="/unit/:id" element={
          <ProtectedRoute>
            <UnitPage />
          </ProtectedRoute>
        } />
        
        {/* PROFIL OLDAL (Védett) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </Box>
  );
};

export default App;

