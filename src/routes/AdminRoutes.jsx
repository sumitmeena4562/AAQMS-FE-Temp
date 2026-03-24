import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout"
import Dashboard from "../pages/Admin/Dashboard";
import Organizations from "../pages/Admin/Organizations";
import RiskAlerts from "../pages/Admin/RiskAlerts";
import Reports from "../pages/Admin/Reports";
import Users from "../pages/Admin/Users_Management";
import Settings from "../pages/Admin/Settings";

import AssignedCoordinators from "../pages/Admin/AssignedCoordinators";
import Coordinator from "../pages/Admin/Coordinator";
import SitePlan from "../pages/Admin/SitePlan";
import FloorPlan from "../pages/Admin/FloorPlan";
import Zones from "../pages/Admin/Zones";
import Inventory from "../pages/Admin/Inventory";
// const ActivityLogs = lazy(() => import('../pages/Admin/ActivityLogs'));

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route path="dashboard" element={<Dashboard />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="coordinators" element={<AssignedCoordinators />} />
                {/* <Route path="coordinators" element={<Coordinator />} /> */}
                <Route path="site-plan" element={<SitePlan />} />
                <Route path="floor-plan" element={<FloorPlan />} />
                <Route path="zones" element={<Zones />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="risk-alerts" element={<RiskAlerts />} />
                {/* <Route path="activity" element={<ActivityLogs />} /> */}
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;