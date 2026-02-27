import { NavLink } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
const SidebarItem = ({ to, label, icon: Icon }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `
                group  flex items-center gap-3 rounded-xl px-4 py-3 
                text-[17px] font-medium transition-all duration-150
                ${isActive
                    ? "bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"}
                `
            }
        >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
        </NavLink>
    );
};

export default SidebarItem;