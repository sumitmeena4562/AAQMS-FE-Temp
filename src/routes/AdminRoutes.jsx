import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Organizations from "../pages/admin/Organizations";
import RiskAlerts from "../pages/admin/RiskAlerts";
import Reports from "../pages/admin/Reports";
import Users from "../pages/admin/Users_Management";
import Settings from "../pages/admin/Settings";
import { Navigate } from "react-router-dom";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route path="Dashboard" element={<Dashboard />} />
                <Route path="Organizations" element={<Organizations />} />
                <Route path="Risk-Alerts" element={<RiskAlerts />} />
                <Route path="Reports" element={<Reports />} />
                <Route path="Users" element={<Users />} />
                <Route path="Settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;