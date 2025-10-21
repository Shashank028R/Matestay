import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from './components/theme-provider.jsx';


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="vite-ui-theme"
      >
        <App />
      </ThemeProvider>  
    </AuthProvider>
  // {/* </StrictMode> */}
);

