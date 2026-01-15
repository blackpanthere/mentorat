import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CreateProject from './pages/CreateProject';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route path="/booking/:slug" element={<BookingPage />} />
        <Route path="/booking/:slug/confirmation" element={<ConfirmationPage />} />
        <Route path="/admin/:slug" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
