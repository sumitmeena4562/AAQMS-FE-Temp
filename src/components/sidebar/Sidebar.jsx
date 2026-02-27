import Logo from "../Branding/Logo";
import SidebarItem from "./SidebarItem";
import {
    HiOutlineSquares2X2,
    HiOutlineBuildingOffice2,
    HiOutlineUsers,
    HiOutlineExclamationTriangle,
    HiOutlineChartBar,
    HiOutlineCog6Tooth,
} from "react-icons/hi2";

const menuItems = [
    { label: "Dashboard", to: "/admin/Dashboard", icon: HiOutlineSquares2X2 },
    { label: "Organization Management", to: "/admin/Organizations", icon: HiOutlineBuildingOffice2 },
    { label: "User Management", to: "/admin/Users", icon: HiOutlineUsers },
    { label: "Risk Alerts", to: "/admin/Risk-Alerts", icon: HiOutlineExclamationTriangle },
    { label: "Reports", to: "/admin/Reports", icon: HiOutlineChartBar },
    { label: "Settings", to: "/admin/Settings", icon: HiOutlineCog6Tooth },
];

const Sidebar = () => {
    return (
        <aside className="w-64 h-screen bg-white border-r border-[#E5E7EB] flex flex-col gap-6">
            <div className="h-16 border-b border-[#E5E7EB] flex items-center px-4 ">
                <Logo size="md" />
            </div>

            <nav className=" px-3  py-6 flex flex-col gap-y-2  ">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.label}
                        to={item.to}
                        label={item.label}
                        icon={item.icon}
                    />
                ))}
            </nav>

        </aside>
    );
};

export default Sidebar;
