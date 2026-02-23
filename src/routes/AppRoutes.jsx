import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Pages
import LandingPage from '../pages/Home/LandingPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
]);

const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
