import { Routes, Route, Navigate } from "react-router-dom";
import CoordLayout from "../layouts/CoordLayout/CoordLayout";
import Dashboard from "../pages/coordinator/Dashboard";

const CoordinatorRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CoordLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default CoordinatorRoutes;
