
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TranslationProvider } from './hooks/useTranslation'

// Hide loading spinner when React app starts
const loadingElement = document.getElementById("loadingIndex");
if (loadingElement) {
  loadingElement.style.display = 'none';
}

createRoot(document.getElementById("root")!).render(
  <TranslationProvider>
    <App />
  </TranslationProvider>
);
