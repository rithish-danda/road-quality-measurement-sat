import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error handling for the entire application
const handleGlobalError = (event: ErrorEvent) => {
  console.error('Global error caught:', event.error);
  event.preventDefault();
};

// Add global error handlers
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Create root with error handling
const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to render application:', error);
    // Render a fallback UI if the main app fails to render
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Something went wrong</h2>
        <p>Please refresh the page to try again.</p>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
}