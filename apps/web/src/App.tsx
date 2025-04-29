import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis/:songId" element={<AnalysisPage />} />
        </Routes>
      </BrowserRouter>
      <button 
        onClick={() => {
          // Use relative path which will be proxied through Vite
          const endpoint = '/api/debug';
          
          console.log(`Testing API connection to: ${endpoint}`);
          fetch(endpoint)
            .then(res => res.json())
            .then(data => {
              console.log('✅ API Connection successful:', data);
              alert('API connection successful! Check browser console for details.');
            })
            .catch(err => {
              console.error('❌ API Connection failed:', err);
              alert('API connection failed. Check browser console for details.');
            });
        }}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded shadow"
      >
        Test API Connection
      </button>
    </QueryClientProvider>
  );
}

export default App;