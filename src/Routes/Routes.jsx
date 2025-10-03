import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


import Login from '../pages/Login';

import Orders from '../pages/Orders';
import Processing from '../pages/Processing';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Layout from '../components/Layout';
import LogViewer from '../components/LogViewer';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
        
       
        <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
        <Route path="/processing" element={<ProtectedRoute><Layout><Processing /> </Layout>  </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/dev/logs" element={<ProtectedRoute><Layout><LogViewer /></Layout></ProtectedRoute>} />
        
        {/* Redirect and 404 */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
