import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArticlePage from './pages/ArticlePage';
import ArticleFormPage from './pages/ArticleFormPage';
import CategoriesPage from './pages/CategoriesPage';
import ReAuthModal from './components/ReAuthModal';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) return null;
    return user
        ? <>{children}</>
        : <Navigate to="/login" state={{ from: location }} replace />;
};

export default function App() {
    return (
        <>
            <ReAuthModal />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/articles/:id" element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
                <Route path="/articles/new" element={<ProtectedRoute><ArticleFormPage /></ProtectedRoute>} />
                <Route path="/articles/:id/edit" element={<ProtectedRoute><ArticleFormPage /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}
