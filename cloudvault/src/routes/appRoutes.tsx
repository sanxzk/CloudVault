import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/login';
import SignupForm from '../components/auth/signup';
import ProtectedRoute from './protectedRoutes';
import Gallery from '../pages/gallery';
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
              <Gallery />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}