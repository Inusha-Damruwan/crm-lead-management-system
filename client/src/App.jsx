import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import LeadForm from './pages/LeadForm';
import LeadEdit from './pages/LeadEdit';
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leads"
                        element={
                            <ProtectedRoute>
                                <Leads />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leads/new"
                        element={
                            <ProtectedRoute>
                                <LeadForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leads/:id"
                        element={
                            <ProtectedRoute>
                                <LeadDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leads/:id/edit"
                        element={
                            <ProtectedRoute>
                                <LeadEdit />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    { /* Settings route removed */ }

                    {/* Redirect to dashboard by default */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
