import { Routes, Route, Navigate } from "react-router-dom";
import FieldLayout from "../layouts/FieldLayout/FieldLayout";
import Dashboard from "../pages/fieldOfficer/Dashboard";

const FieldOfficerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FieldLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default FieldOfficerRoutes;
