import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/login';
import SignupForm from '../components/auth/signup';
import ProtectedRoute from './protectedRoutes';

function GalleryPlaceholder() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div>
      <h1>Gallery (protected)</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <GalleryPlaceholder />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}