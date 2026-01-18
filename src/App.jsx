import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { testConnection } from './lib/supabase';
import './index.css';

function App() {
  useEffect(() => {
    // Test Supabase connection on app load
    testConnection();

    // Screenshot Protection: Disable Context Menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Screenshot Protection: Deter keyboard shortcuts
    const handleKeyDown = (e) => {
      // Block PrintScreen (key code 44), though behavior varies by browser/OS
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshots are disabled for privacy.');
      }

      // Block Cmd/Ctrl + P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('Printing is disabled for privacy.');
      }

      // Block Cmd/Ctrl + Shift + S (Some screenshot tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <AppRoutes />;
}

export default App;
