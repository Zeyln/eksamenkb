import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArticlePage from './pages/ArticlePage';
import ArticleFormPage from './pages/ArticleFormPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/articles/:id" element={<ArticlePage />} />
      <Route path="/articles/new" element={
        <ProtectedRoute><ArticleFormPage /></ProtectedRoute>
      } />
      <Route path="/articles/:id/edit" element={
        <ProtectedRoute><ArticleFormPage /></ProtectedRoute>
      } />
    </Routes>
  );
}
