import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production export contains the page; Vite's development shell is empty.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
