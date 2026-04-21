import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout"

// Lazy load admin pages for optimized bundle size
const Dashboard = lazy(() => import("../pages/Admin/Dashboard"));
const Organizations = lazy(() => import("../pages/Admin/Organizations"));
const RiskAlerts = lazy(() => import("../pages/Admin/RiskAlerts"));
const Reports = lazy(() => import("../pages/Admin/Reports"));
const Users = lazy(() => import("../pages/Admin/Users_Management"));
const Settings = lazy(() => import("../pages/Admin/Settings"));
const Coordinator = lazy(() => import("../pages/Admin/Coordinator"));
const SitePlan = lazy(() => import("../pages/Admin/SitePlan"));
const FloorPlan = lazy(() => import("../pages/Admin/FloorPlan"));
const Zones = lazy(() => import("../pages/Admin/Zones"));
const Inventory = lazy(() => import("../pages/Admin/Inventory"));
const AllHistory = lazy(() => import("../pages/Admin/AllHistory"));

const AdminRoutes = () => {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="organizations" element={<Organizations />} />
                    <Route path="coordinators" element={<Coordinator />} />
                    <Route path="site-plan" element={<SitePlan />} />
                    <Route path="floor-plan" element={<FloorPlan />} />
                    <Route path="zones" element={<Zones />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="risk-alerts" element={<RiskAlerts />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="history" element={<AllHistory />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AdminRoutes;