import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Starting React app...');

try {
  const container = document.getElementById("root");
  console.log('Root container found:', container);

  if (container) {
    const root = createRoot(container);
    console.log('React root created, rendering app...');
    root.render(<App />);
    console.log('App rendered successfully!');
  } else {
    console.error('Root container not found!');
  }
} catch (error) {
  console.error('Error starting React app:', error);
}
