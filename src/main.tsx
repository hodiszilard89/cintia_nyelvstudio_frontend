import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom'; //
import { AuthProvider } from './components/AuthContext.tsx';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Ide kerül a Google Cloud-ból kapott Client ID */}
    <GoogleOAuthProvider clientId="79799390146-jf5tfmbtk8njiag632c6l2hub9qmjekm.apps.googleusercontent.com">
      <ChakraProvider>
       <BrowserRouter> 
         <AuthProvider> {/* 👈 2. Ebbe csomagoljuk be az App-ot */}
          <App />
        </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    </GoogleOAuthProvider>
  </StrictMode >,
)
