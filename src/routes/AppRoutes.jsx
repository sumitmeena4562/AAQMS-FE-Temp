import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Pages
import LandingPage from '../pages/Home/LandingPage';
import Login from '../pages/Auth/loginpage';

// Role Routes
import AdminRoutes from './AdminRoutes';
import CoordinatorRoutes from './CoordinatorRoutes';
import FieldOfficerRoutes from './FieldOfficerRoutes';
import Ragisterpage from '../pages/Auth/Ragisterpage';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Access */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/ragister" element={<Ragisterpage/>}/>

                {/* Role-Based Access */}
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
                <Route path="/field-officer/*" element={<FieldOfficerRoutes />} />
            </Routes>

            {/* Global Toaster for notifications */}
            <Toaster position='top-center' />
        </BrowserRouter>
    );
};

export default AppRoutes;
