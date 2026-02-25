import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Pages
import LandingPage from '../pages/Home/LandingPage';
import Login from '../pages/Auth/loginpage'


const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path:'/login',
        element:<Login/>
    }
]);

const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
