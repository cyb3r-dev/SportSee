import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/Login/Login';
import DashboardPage from './pages/Dashboard/Dashboard';
import ProfilePage from './pages/Profile/Profile';
import './global.css';

const ProtectedRoute = ({ condition, redirect }) => {
    if (condition) return <Navigate to={redirect} replace />;
    return <Outlet />;
};

export default function App() {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute condition={user != null} redirect="/dashboard" />}>
                    <Route path="/" element={<LoginPage />} />
                </Route>
                <Route element={<ProtectedRoute condition={user == null} redirect="/" />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};