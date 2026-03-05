import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout"
import Dashboard from "../pages/admin/Dashboard";
import Organizations from "../pages/admin/Organizations";
import RiskAlerts from "../pages/admin/RiskAlerts";
import Reports from "../pages/admin/Reports";
import Users from "../pages/admin/Users_Management";
import Settings from "../pages/admin/Settings";
import { Navigate } from "react-router-dom";
import Coordinator  from "../pages/admin/Coordinator";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route path="dashboard" element={<Dashboard />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="coordinators" element={<Coordinator/>}/>
                <Route path="risk-alerts" element={<RiskAlerts />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;