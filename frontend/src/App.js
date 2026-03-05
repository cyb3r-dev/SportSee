import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import './global.css';

const ProtectedRoute = ({ condition, redirect = "/" }) => {
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
                    <Route path="/" element={<Login />} />
                </Route>
                <Route element={<ProtectedRoute condition={user == null} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};