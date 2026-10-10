import { createRoot } from 'react-dom/client';
import App from './src/App.tsx';

createRoot(document.querySelector<HTMLDivElement>('#root')!).render(<App />);
