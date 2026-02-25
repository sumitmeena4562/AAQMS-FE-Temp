import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Pages
import LandingPage from '../pages/Home/LandingPage';
import Login from '../pages/Auth/loginpage';
import ProtectedRoute from './ProtectedRoute';

// Example Dashboard Component for testing
const DummyDashboard = () => <h1>Secure Dashboard Page</h1>;

const router = createBrowserRouter([
      // Public Routes
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path:'/login',
        element:<Login/>
    },

    // Protected Routes 
    {
         element:<ProtectedRoute/>,
         children:[
            {path:'/dashboard',element:<DummyDashboard/>}
         ]
    }
]);

const AppRoutes = () => {
    return (<>
        
    <RouterProvider router={router} />
    <Toaster  position='top-center'/>
    </>);

};

export default AppRoutes;
