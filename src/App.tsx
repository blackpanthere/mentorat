import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateProject from './pages/CreateProject';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateProject />} />
        <Route path="/booking/:slug" element={<BookingPage />} />
        <Route path="/booking/:slug/confirmation" element={<ConfirmationPage />} />
        <Route path="/admin/:slug" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
