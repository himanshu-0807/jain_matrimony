import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { testConnection } from './lib/supabase';
import './index.css';

function App() {
  useEffect(() => {
    // Test Supabase connection on app load
    testConnection();
  }, []);

  return <AppRoutes />;
}

export default App;
