import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
